const ClientMaster = require("../models/ClientMaster");

exports.createClient = async (req, res) => {
    try {
        const body = req.body;
        const files = req.files;

        // Auto assign BDA/BDE/BDM
        const designation = req.user.designation;
        let bda = null, bde = null, bdm = null;

        if (designation === "bda") bda = req.user._id;
        if (designation === "bde") bde = req.user._id;
        if (designation === "bdm") bdm = req.user._id;

        const dealAmount = Number(body.dealAmount || 0);
        const tokenReceivedAmount = Number(body.tokenReceivedAmount || 0);

        const receivedPercent = dealAmount > 0
            ? ((tokenReceivedAmount / dealAmount) * 100).toFixed(2)
            : 0;

        const remainPercent = (100 - receivedPercent).toFixed(2);
        const balanceAmount = dealAmount - tokenReceivedAmount;

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

            dealAmount,
            tokenReceivedAmount,
            receivedPercent,
            remainPercent,
            balanceAmount,

            modeOfPayment: body.modeOfPayment,
            additionalCommitment: body.additionalCommitment,
            remark: body.remark,

            createdBy: req.user._id,
        });

        await client.save();

        res.status(201).json({ success: true, message: "Client created", client });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
};


exports.getClients = async (req, res) => {
    try {
        const filter =
            req.user.role === "admin"
                ? {}
                : {
                    createdBy: req.user._id,
                };

        const clients = await ClientMaster.find(filter).populate(
            "createdBy",
            "name designation email"
        );

        res.json({ success: true, clients });
    } catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
