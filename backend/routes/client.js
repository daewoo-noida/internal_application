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
    updateClient
} = require("../controllers/clientController");


// ============================
// UPLOAD FIELDS (Client Create)
// ============================
const uploadFields = upload.fields([
    { name: "adharImages", maxCount: 2 },
    { name: "panImage", maxCount: 1 },
    { name: "companyPanImage", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
]);


// ============================
// CREATE CLIENT (Sales/Admin)
// ============================
router.post(
    "/",
    protect,
    allowRoles("Sales", "admin"),
    uploadFields,
    createClient
);


// ============================
// GET CLIENTS (Admin OR Sales)
// ============================
router.get("/", protect, getClients);


// ============================
// GET CLIENT BY ID
// ============================
router.get("/:id", protect, getClientById);


// ============================
// SALESMAN: ADD SECOND PAYMENT
// ============================
router.post(
    "/:id/add-payment",
    protect,
    upload.single("proof"),  // only one proof file
    addPayment
);


// ============================
// ADMIN: APPROVE PAYMENT
// ============================
router.post(
    "/:clientId/approve-payment/:paymentId",
    protect,
    allowRoles("admin"),  // 👈 ONLY ADMIN
    approveSecondPayment
);


// ============================
// ADMIN: REJECT PAYMENT
// ============================
router.post(
    "/:clientId/reject-payment/:paymentId",
    protect,
    allowRoles("admin"),  // 👈 ONLY ADMIN
    rejectSecondPayment
);

router.put("/:id",
    protect,
    allowRoles("admin"),
    updateClient
);

module.exports = router;
