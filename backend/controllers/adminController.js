const Client = require("../models/ClientMaster");
const User = require("../models/User");

// =====================
// DASHBOARD STATS
// =====================
exports.getAdminStats = async (req, res) => {
    try {
        const clients = await Client.find();

        const totalClients = clients.length;

        const totalDealAmount = clients.reduce((sum, c) => sum + (c.dealAmount || 0), 0);

        const totalReceived = clients.reduce(
            (sum, c) => sum + (c.tokenReceivedAmount || 0),
            0
        );

        const totalDue = totalDealAmount - totalReceived;

        res.json({
            success: true,
            data: {
                totalClients,
                totalDealAmount,
                totalReceived,
                totalDue
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};


exports.getAllSalesmen = async (req, res) => {
    try {
        const salesmen = await User.find({ role: "Sales" })
            .select("name email phone designation createdAt");

        const result = [];

        for (const salesman of salesmen) {
            const clients = await Client.find({ createdBy: salesman._id });

            const totalClients = clients.length;

            const totalDealAmount = clients.reduce(
                (sum, c) => sum + (c.dealAmount || 0),
                0
            );

            const totalReceived = clients.reduce(
                (sum, c) => sum + (c.tokenReceivedAmount || 0),
                0
            );

            result.push({
                ...salesman._doc,
                totalClients,
                totalDealAmount,
                totalReceived
            });
        }

        res.json({ success: true, salesmen: result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};


exports.getSalesmanClients = async (req, res) => {
    try {
        const clients = await Client.find({ createdBy: req.params.id })
            .populate("createdBy", "name email phone designation");

        res.json({ success: true, clients });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};


exports.getAllSalesmen = async (req, res) => {
    try {
        const salesmen = await User.find({ role: "Sales" })
            .select("name email phone designation phone createdAt isVerified");

        const result = [];

        for (const salesman of salesmen) {
            const clients = await Client.find({ createdBy: salesman._id });

            const totalClients = clients.length;
            const totalDealAmount = clients.reduce((sum, c) => sum + (c.dealAmount || 0), 0);
            const totalReceived = clients.reduce((sum, c) => sum + (c.tokenReceivedAmount || 0), 0);

            result.push({
                ...salesman._doc,
                totalClients,
                totalDealAmount,
                totalReceived,
                isVerified: salesman.isVerified
            });
        }

        res.json({ success: true, salesmen: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};


exports.getPendingDocuments = async (req, res) => {
    try {
        const clients = await Client.find();

        const pending = clients.map(c => ({
            client: c.name,
            missingAadhar: c.adharImages.length < 2,
            missingPan: !c.panImage,
            missingGST: !c.gst,
            missingAddressProof: !c.addressProof,
            createdAt: c.createdAt
        }));

        res.json({ success: true, pending });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};

exports.verifySalesman = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isVerified = !user.isVerified; // Toggle verify/unverify
        await user.save();

        res.json({
            success: true,
            message: user.isVerified ? "User Verified" : "User Unverified",
            isVerified: user.isVerified
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", err });
    }
};

exports.deleteSalesman = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Sales user deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
