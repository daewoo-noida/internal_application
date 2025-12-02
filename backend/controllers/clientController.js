const ClientMaster = require("../models/ClientMaster");

/* ===========================================================
    GLOBAL FUNCTION → Recalculate ALL payment totals
=========================================================== */
const recalcPayments = (client) => {
    const deal = Number(client.dealAmount) || 0;

    // BASE received = ONLY initial token
    const baseToken = Number(client.tokenReceivedAmount) || 0;

    // Sum of approved additional payments
    const approvedSum = client.secondPayments
        .filter(p => p.status === "approved")
        .reduce((acc, p) => acc + Number(p.amount), 0);

    // FINAL RECEIVED
    const totalReceived = baseToken + approvedSum;

    client.totalReceived = totalReceived; // optional

    client.receivedPercent = deal > 0
        ? Number(((totalReceived / deal) * 100).toFixed(2))
        : 0;

    client.remainPercent = Number((100 - client.receivedPercent).toFixed(2));

    client.balanceAmount = Number((deal - totalReceived).toFixed(2));

    return client;
};

/* ===========================================================
    CREATE CLIENT
=========================================================== */
exports.createClient = async (req, res) => {
    try {
        const body = req.body;
        const files = req.files;

        const designation = req.user.designation;
        let bda = null,
            bde = null,
            bdm = null;

        if (designation === "bda") bda = req.user._id;
        if (designation === "bde") bde = req.user._id;
        if (designation === "bdm") bdm = req.user._id;

        const client = new ClientMaster({
            name: body.name,
            email: body.email,
            phone: body.phone,
            altPhone: body.altPhone,
            territory: body.territory,
            country: "India",
            state: body.state,
            district: body.district,
            city: body.city,
            streetAddress: body.streetAddress,
            pin: body.pin,

            adharImages: (files?.adharImages || []).map((f) => ({
                filename: f.filename,
                path: f.path,
            })),

            panImage: files?.panImage
                ? { filename: files.panImage[0].filename, path: files.panImage[0].path }
                : null,

            companyPanImage: files?.companyPanImage
                ? { filename: files.companyPanImage[0].filename, path: files.companyPanImage[0].path }
                : null,

            addressProof: files?.addressProof
                ? { filename: files.addressProof[0].filename, path: files.addressProof[0].path }
                : null,

            gst: body.gst,

            officeBranch: body.officeBranch,

            bda,
            bde,
            bdm,

            leadSource: body.leadSource,
            tokenDate: body.tokenDate,

            dealAmount: Number(body.dealAmount),
            tokenReceivedAmount: Number(body.tokenReceivedAmount),

            modeOfPayment: body.modeOfPayment,
            additionalCommitment: body.additionalCommitment,
            remark: body.remark,

            createdBy: req.user._id,
        });

        // APPLY GLOBAL PAYMENT RECALCULATION
        recalcPayments(client);

        await client.save();

        res.status(201).json({ success: true, message: "Client created", client });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
};

/* ===========================================================
    GET ALL CLIENTS (ADMIN OR SALESMAN)
=========================================================== */
exports.getClients = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };

        const clients = await ClientMaster.find(filter).populate(
            "createdBy",
            "name designation email"
        );

        // AUTO FIX ALL CLIENT TOTALS
        for (let client of clients) {
            recalcPayments(client);
            await client.save();
        }

        res.json({ success: true, clients });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ===========================================================
    GET CLIENT BY ID (ADMIN OR SALESMAN)
=========================================================== */
exports.getClientById = async (req, res) => {
    try {
        const client = await ClientMaster.findById(req.params.id)
            .populate("bda", "name email designation")
            .populate("bde", "name email designation")
            .populate("bdm", "name email designation")
            .populate("createdBy", "name email designation");

        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        // AUTO UPDATE TOTALS ON FETCH
        recalcPayments(client);
        await client.save();

        res.json({ success: true, client });
    } catch (err) {
        console.log("Get client error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ===========================================================
    SALES PERSON: ADD SECOND PAYMENT (PENDING)
=========================================================== */
exports.addPayment = async (req, res) => {
    try {
        const client = await ClientMaster.findById(req.params.id);

        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        const payment = {
            amount: Number(req.body.amount),
            paymentDate: req.body.paymentDate,
            mode: req.body.mode,
            transactionId: req.body.transactionId,
            status: "pending",
            proof: req.file ? { filename: req.file.filename, path: req.file.path } : null,
            createdAt: new Date(),
        };

        client.secondPayments.push(payment);

        recalcPayments(client); // pending doesn't affect totals
        await client.save();

        res.json({ success: true, message: "Payment submitted for approval", client });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ===========================================================
    ADMIN: APPROVE PAYMENT
=========================================================== */
exports.approveSecondPayment = async (req, res) => {
    try {
        const { clientId, paymentId } = req.params;

        const client = await ClientMaster.findById(clientId);
        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        const payment = client.secondPayments.id(paymentId);
        if (!payment)
            return res.status(404).json({ success: false, message: "Payment not found" });

        if (payment.status === "approved") {
            return res.json({ success: false, message: "Payment already approved" });
        }

        payment.status = "approved";

        // AUTO RECALCULATE EVERYTHING
        recalcPayments(client);

        await client.save();

        res.json({
            success: true,
            message: "Payment approved & totals updated",
            client,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};

/* ===========================================================
    ADMIN: REJECT PAYMENT
=========================================================== */
exports.rejectSecondPayment = async (req, res) => {
    try {
        const { clientId, paymentId } = req.params;

        const client = await ClientMaster.findById(clientId);
        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        const payment = client.secondPayments.id(paymentId);
        if (!payment)
            return res.status(404).json({ success: false, message: "Payment not found" });

        payment.status = "rejected";

        recalcPayments(client);
        await client.save();

        res.json({ success: true, message: "Payment rejected", client });
    } catch (err) {
        console.error("Reject Payment Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;

        let client = await ClientMaster.findById(id);
        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        // Update all fields from req.body
        Object.keys(req.body).forEach((key) => {
            client[key] = req.body[key];
        });

        // Recalculate payment totals
        recalcPayments(client);

        await client.save();

        res.json({
            success: true,
            message: "Client updated successfully",
            client
        });

    } catch (err) {
        console.log("Update client error:", err);
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};
