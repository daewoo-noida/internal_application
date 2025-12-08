const Client = require("../models/ClientMaster");
const User = require("../models/User");

/* ===========================
    ADMIN DASHBOARD STATS
=========================== */
// In your clientController.js file, update the getAdminStats function:

/* ===========================
    ADMIN DASHBOARD STATS - UPDATED VERSION
=========================== */
exports.getAdminStats = async (req, res) => {
    try {
        const clients = await Client.find();

        let totalClients = 0;
        let totalDealAmount = 0;
        let totalReceived = 0;
        let totalDue = 0;

        clients.forEach((c) => {
            totalClients++;
            const deal = Number(c.dealAmount) || 0;
            const baseToken = Number(c.tokenReceivedAmount) || 0;

            // Calculate approved second payments
            const approvedSecondPayments = c.secondPayments
                .filter(p => p.status === "approved")
                .reduce((sum, p) => sum + Number(p.amount || 0), 0);

            // Total received = base token + approved second payments
            const clientTotalReceived = baseToken + approvedSecondPayments;

            totalDealAmount += deal;
            totalReceived += clientTotalReceived;
            totalDue += (deal - clientTotalReceived);
        });

        res.json({
            success: true,
            data: {
                totalClients,
                totalDealAmount,
                totalReceived,
                totalDue,
                balanceAmount: totalDue  // Adding balanceAmount for consistency
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};

/* ===========================
      ALL SALESMEN LIST
=========================== */
exports.getAllSalesmen = async (req, res) => {
    try {
        const salesmen = await User.find({ role: "Sales" })
            .select("name email phone designation isVerified createdAt");

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
                totalReceived
            });
        }

        res.json({ success: true, salesmen: result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};


/* ===========================
   SALES TEAM AGGREGATED API
=========================== */
exports.salesmen = async (req, res) => {
    try {
        const salesmen = await User.aggregate([
            { $match: { role: "Sales" } },

            {
                $lookup: {
                    from: "clientmasters",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "clients"
                }
            },

            {
                $addFields: {
                    totalClients: { $size: "$clients" },
                    totalDealAmount: { $sum: "$clients.dealAmount" },
                    totalTokenReceived: { $sum: "$clients.tokenReceivedAmount" },
                    // Calculate total approved second payments
                    totalApprovedSecondPayments: {
                        $sum: {
                            $reduce: {
                                input: "$clients",
                                initialValue: 0,
                                in: {
                                    $add: [
                                        "$$value",
                                        {
                                            $sum: {
                                                $map: {
                                                    input: {
                                                        $filter: {
                                                            input: "$$this.secondPayments",
                                                            as: "payment",
                                                            cond: { $eq: ["$$payment.status", "approved"] }
                                                        }
                                                    },
                                                    as: "approvedPayment",
                                                    in: "$$approvedPayment.amount"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            },

            {
                $addFields: {
                    totalReceived: {
                        $add: ["$totalTokenReceived", "$totalApprovedSecondPayments"]
                    }
                }
            },

            {
                $project: {
                    name: 1,
                    designation: 1,
                    totalClients: 1,
                    totalDealAmount: 1,
                    totalTokenReceived: 1,
                    totalApprovedSecondPayments: 1,
                    totalReceived: 1
                }
            }
        ]);

        res.json({ success: true, salesmen });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


/* ===========================
   SALESMAN → CLIENT LIST
=========================== */
exports.getSalesmanClients = async (req, res) => {
    try {
        const clients = await Client.find({ createdBy: req.params.id })
            .populate("createdBy", "name email phone designation");

        res.json({ success: true, clients });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};


/* ===========================
    PENDING DOCUMENT CHECK
=========================== */
exports.getPendingDocuments = async (req, res) => {
    try {
        const clients = await Client.find();

        const pending = clients.map(c => ({
            client: c.name,
            missingAadhar: c.adharImages.length < 2,
            missingPan: !c.panImage,
            missingGST: !c.gstFile,
            missingGst: !c.gstFile,
            createdAt: c.createdAt
        }));

        res.json({ success: true, pending });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};


/* ===========================
        VERIFY SALESMAN
=========================== */
exports.verifySalesman = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.isVerified = !user.isVerified;
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


/* ===========================
        DELETE SALESMAN
=========================== */
exports.deleteSalesman = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Sales user deleted successfully" });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


/* ===========================
   APPROVE SECONDARY PAYMENT
=========================== */
exports.approvePayment = async (req, res) => {
    try {
        const { id, paymentId } = req.params;

        const client = await Client.findById(id);
        if (!client)
            return res.status(404).json({ success: false, message: "Client not found" });

        const payment = client.secondPayments.id(paymentId);
        if (!payment)
            return res.status(404).json({ success: false, message: "Payment not found" });

        if (payment.status === "approved")
            return res.json({ success: false, message: "Payment already approved" });

        payment.status = "approved";

        // Update totals
        client.tokenReceivedAmount += Number(payment.amount);

        const totalDeal = Number(client.dealAmount);
        const received = Number(client.tokenReceivedAmount);

        client.receivedPercent = ((received / totalDeal) * 100).toFixed(2);
        client.remainPercent = (100 - client.receivedPercent).toFixed(2);
        client.balanceAmount = totalDeal - received;

        await client.save();

        res.json({ success: true, message: "Payment approved", client });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


exports.getGraphStats = async (req, res) => {
    try {
        const clients = await Client.find();

        // 12 months arrays
        const monthlyDeal = Array(12).fill(0);
        const monthlyReceived = Array(12).fill(0);

        clients.forEach((c) => {
            if (!c.createdAt) return;

            const d = new Date(c.createdAt);
            const m = d.getMonth(); // 0–11

            const deal = Number(c.dealAmount || 0);
            const received = Number(c.tokenReceivedAmount || 0);

            monthlyDeal[m] += deal;
            monthlyReceived[m] += received;
        });

        // YEARLY (last 5 years)
        const currentYear = new Date().getFullYear();
        const yearlyLabels = [];
        const yearlyDeal = [];
        const yearlyReceived = [];

        for (let y = currentYear - 4; y <= currentYear; y++) {
            yearlyLabels.push(y);

            let dSum = 0;
            let rSum = 0;

            clients.forEach((c) => {
                if (!c.createdAt) return;
                const cy = new Date(c.createdAt).getFullYear();

                if (cy === y) {
                    dSum += Number(c.dealAmount || 0);
                    rSum += Number(c.tokenReceivedAmount || 0);
                }
            });

            yearlyDeal.push(dSum);
            yearlyReceived.push(rSum);
        }

        res.json({
            success: true,
            monthly: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                deal: monthlyDeal,
                received: monthlyReceived,
            },
            yearly: {
                labels: yearlyLabels,
                deal: yearlyDeal,
                received: yearlyReceived,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error", err });
    }
};