const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
    getAdminStats,
    getAllSalesmen,
    getSalesmanClients,
    getPendingDocuments, getSalesmanStats, verifySalesman, deleteSalesman,
    getGraphStats
} = require("../controllers/adminController");

router.get("/stats", protect, allowRoles("admin"), getAdminStats);
router.get("/salesmen", protect, allowRoles("admin"), getAllSalesmen);
router.get("/salesman/:id/clients", protect, allowRoles("admin"), getSalesmanClients);
router.get("/pending", protect, allowRoles("admin"), getPendingDocuments);
router.get("/salesman/:id", protect, allowRoles("admin"), async (req, res) => {
    const user = await User.findById(req.params.id).select("name email phone designation");
    res.json({ success: true, user });
});
router.put("/verify/:id", protect, allowRoles("admin"), verifySalesman);
router.delete("/salesman/:id", protect, allowRoles("admin"), deleteSalesman);


router.get("/stats-graph", protect, allowRoles("admin"), getGraphStats);

module.exports = router;
