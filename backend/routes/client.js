const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roleMiddleware");
const { createClient, getClients } = require("../controllers/clientController");

// Upload fields
const uploadFields = upload.fields([
    { name: "adharImages", maxCount: 2 },
    { name: "panImage", maxCount: 1 },
    { name: "companyPanImage", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
]);

router.post(
    "/",
    protect,
    allowRoles("Sales", "admin"),
    uploadFields,
    createClient
);

router.get("/", protect, getClients);

module.exports = router;
