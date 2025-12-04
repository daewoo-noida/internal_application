// ==========================================
// Client Controller
// ==========================================
const ClientMaster = require("../models/ClientMaster");

// Build public URL for uploaded file
const buildFileUrl = (req, filename) => {
    return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// Convert multer file into DB-friendly object
const getFile = (req, files, fieldname) => {
    const f = files.find((x) => x.fieldname === fieldname);
    if (!f) return null;

    return {
        filename: f.filename,
        path: `/uploads/${f.filename}`,
        url: buildFileUrl(req, f.filename)
    };
};

// ==========================================
// PAYMENT CALCULATION
// ==========================================
const recalcPayments = (client) => {
    const deal = Number(client.dealAmount) || 0;
    const baseToken = Number(client.tokenReceivedAmount) || 0;

    const approvedSum = client.secondPayments
        .filter(p => p.status === "approved")
        .reduce((acc, p) => acc + Number(p.amount), 0);

    const totalReceived = baseToken + approvedSum;

    client.totalReceived = totalReceived;
    client.receivedPercent = deal ? Number(((totalReceived / deal) * 100).toFixed(2)) : 0;
    client.remainPercent = Number((100 - client.receivedPercent).toFixed(2));
    client.balanceAmount = Number((deal - totalReceived).toFixed(2));

    return client;
};

// ==========================================
// CREATE CLIENT
// ==========================================
exports.createClient = async (req, res) => {
    try {
        const body = req.body;
        const files = req.files || [];

        const userDesignation = req.user.designation?.toLowerCase();

        let bda = null, bde = null, bdm = null, bhead = null;
        if (userDesignation.includes("bda")) bda = req.user._id;
        if (userDesignation.includes("bde")) bde = req.user._id;
        if (userDesignation.includes("bdm")) bdm = req.user._id;
        if (userDesignation.includes("head")) bhead = req.user._id;

        const client = new ClientMaster({
            name: body.name,
            email: body.email,
            phone: body.phone,
            altPhone: body.altPhone,

            personalState: body.personalState,
            personalDistrict: body.personalDistrict,
            personalCity: body.personalCity,
            personalStreetAddress: body.personalStreetAddress,
            personalPin: body.personalPin,

            franchiseType: body.franchiseType,
            franchiseState: body.franchiseState,
            franchiseDistrict: body.franchiseDistrict,
            franchiseCity: body.franchiseCity,
            franchisePin: body.franchisePin,
            territory: body.territory,

            adharImages: files
                .filter((f) => f.fieldname === "adharImages")
                .map((f) => ({
                    filename: f.filename,
                    path: `/uploads/${f.filename}`,
                    url: buildFileUrl(req, f.filename),
                })),

            panImage: getFile(req, files, "panImage"),
            companyPanImage: getFile(req, files, "companyPanImage"),
            gstFile: getFile(req, files, "gstFile"),
            paymentImage: getFile(req, files, "paymentImage"),

            dealAmount: Number(body.dealAmount),
            tokenReceivedAmount: Number(body.tokenReceivedAmount),
            tokenDate: body.tokenDate,
            modeOfPayment: body.modeOfPayment,

            leadSource: body.leadSource,
            officeBranch: body.officeBranch,
            remark: body.remark,

            bda,
            bde,
            bdm,
            bhead,

            createdBy: req.user._id
        });

        await client.save();
        res.json({ success: true, client });

    } catch (err) {
        console.log("Create Client Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==========================================
// GET ALL CLIENTS
// ==========================================
exports.getClients = async (req, res) => {
    try {
        const designation = req.user.designation?.toLowerCase();

        const filter = designation === "admin" ? {} : { createdBy: req.user._id };

        const clients = await ClientMaster.find(filter)
            .populate("createdBy", "name email designation");

        clients.forEach((c) => {
            recalcPayments(c);
            c.save();
        });

        res.json({ success: true, clients });

    } catch (err) {
        console.error("GET CLIENTS ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// GET CLIENT BY ID
// ==========================================
exports.getClientById = async (req, res) => {
    try {
        const client = await ClientMaster.findById(req.params.id)
            .populate("bda", "name email designation")
            .populate("bde", "name email designation")
            .populate("bdm", "name email designation")
            .populate("bhead", "name email designation")
            .populate("createdBy", "name email designation");

        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        recalcPayments(client);
        await client.save();

        res.json({ success: true, client });

    } catch (err) {
        console.log("Get Client Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// ADD SECOND PAYMENT (Sales Role)
// ==========================================
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
            proof: req.file
                ? {
                    filename: req.file.filename,
                    path: `/uploads/${req.file.filename}`,
                    url: buildFileUrl(req, req.file.filename)
                }
                : null,
            createdAt: new Date(),
        };

        client.secondPayments.push(payment);
        recalcPayments(client);
        await client.save();

        res.json({ success: true, message: "Payment added (pending approval)", client });

    } catch (err) {
        console.log("Add Payment Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// APPROVE PAYMENT (Admin)
// ==========================================
exports.approveSecondPayment = async (req, res) => {
    try {
        const { clientId, paymentId } = req.params;

        const client = await ClientMaster.findById(clientId);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });

        const payment = client.secondPayments.id(paymentId);
        if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

        if (payment.status === "approved")
            return res.json({ success: false, message: "Payment already approved" });

        payment.status = "approved";
        recalcPayments(client);

        await client.save();
        res.json({ success: true, message: "Payment approved", client });

    } catch (err) {
        console.log("Approve Payment Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// REJECT PAYMENT (Admin)
// ==========================================
exports.rejectSecondPayment = async (req, res) => {
    try {
        const { clientId, paymentId } = req.params;

        const client = await ClientMaster.findById(clientId);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });

        const payment = client.secondPayments.id(paymentId);
        if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

        payment.status = "rejected";
        recalcPayments(client);

        await client.save();
        res.json({ success: true, message: "Payment rejected", client });

    } catch (err) {
        console.error("Reject Payment Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// UPDATE CLIENT
// ==========================================
exports.updateClient = async (req, res) => {
    try {
        const client = await ClientMaster.findById(req.params.id);
        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        const allowed = [
            "name", "email", "phone", "altPhone",
            "personalState", "personalDistrict", "personalCity", "personalStreetAddress", "personalPin",
            "franchiseType", "franchiseState", "franchiseDistrict", "franchiseCity", "franchisePin",
            "territory",
            "dealAmount", "tokenReceivedAmount", "modeOfPayment", "tokenDate",
            "leadSource", "officeBranch", "remark"
        ];

        allowed.forEach((field) => {
            if (req.body[field] !== undefined) client[field] = req.body[field];
        });

        recalcPayments(client);
        await client.save();

        res.json({ success: true, message: "Client updated", client });

    } catch (err) {
        console.log("Update Client Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
