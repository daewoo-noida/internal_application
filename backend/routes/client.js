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
} = require("../controllers/clientController");

// FIX — accept ANY number of files and text fields
router.post(
    "/",
    protect,
    allowRoles("sales", "admin", "bda", "bde", "bdm", "bhead"),
    upload.any(),
    createClient
);

router.get("/", protect, getClients);
router.get("/:id", protect, getClientById);

router.post("/:id/add-payment", protect, upload.single("proof"), addPayment);

router.post(
    "/:clientId/approve-payment/:paymentId",
    protect,
    allowRoles("admin"),
    approveSecondPayment
);

router.post(
    "/:clientId/reject-payment/:paymentId",
    protect,
    allowRoles("admin"),
    rejectSecondPayment
);

router.put(
    "/:id",
    protect,
    allowRoles("admin"),
    upload.any(),
    updateClient
);

module.exports = router;
