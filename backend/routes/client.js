const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
    createClient,
    getClients,
    getClientById,
    addPayment,
    approveSecondPayment,
    rejectSecondPayment,
    updateClient,
    deleteClient,
    deleteSecondPayment
} = require("../controllers/clientController");


router.post(
    "/",
    protect,
    allowRoles("Sales", "admin"),
    upload.any(),
    createClient
);

// Normal routes
router.get("/", protect, getClients);
router.get("/:id", protect, getClientById);

router.post("/:id/add-payment", protect, upload.single("proof"), addPayment);

router.post("/:clientId/approve-payment/:paymentId", protect, allowRoles("admin"), approveSecondPayment);

router.post("/:clientId/reject-payment/:paymentId", protect, allowRoles("admin"), rejectSecondPayment);

router.delete("/:clientId/delete-payment/:paymentId", protect, allowRoles("admin"), deleteSecondPayment);


router.put("/:id", protect, allowRoles("admin"), upload.any(), updateClient);

router.delete("/:id", protect, allowRoles("Sales", "admin"), deleteClient);

module.exports = router;
