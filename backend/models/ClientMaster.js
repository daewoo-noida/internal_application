const mongoose = require("mongoose");

const ClientMasterSchema = new mongoose.Schema({

   /* ===========================
      PERSONAL DETAILS
   ============================ */
   name: { type: String, required: true },
   email: { type: String, required: true, lowercase: true },
   phone: { type: String, required: true },
   altPhone: { type: String },

   personalState: { type: String },
   personalDistrict: { type: String },
   personalCity: { type: String },
   personalStreetAddress: { type: String },
   personalPin: { type: String },

   /* ===========================
      FRANCHISE DETAILS
   ============================ */
   franchiseType: { type: String, required: true },

   franchiseState: { type: String },
   franchiseDistrict: { type: String },
   franchiseCity: { type: String },
   franchisePin: { type: String },

   territory: { type: String }, // MF + DDP

   /* ===========================
      DOCUMENTS
   ============================ */
   adharImages: [{ filename: String, path: String }],
   panImage: { filename: String, path: String },
   companyPanImage: { filename: String, path: String },

   gstNumber: { type: String },
   gstFile: { filename: String, path: String },

   /* ===========================
      OFFICE DETAILS
   ============================ */
   officeBranch: { type: String },

   bda: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   bde: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   bdm: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   bhead: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

   leadSource: { type: String },

   /* ===========================
      PAYMENT DETAILS
   ============================ */
   dealAmount: { type: Number, default: 0 },
   tokenReceivedAmount: { type: Number, default: 0 },
   tokenDate: { type: Date },

   receivedPercent: { type: Number, default: 0 },
   remainPercent: { type: Number, default: 100 },
   balanceAmount: { type: Number, default: 0 },

   modeOfPayment: { type: String },
   proofOfPayment: { type: String },

   remark: { type: String },

   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

   /* ===========================
       SECOND PAYMENT ARRAY
   ============================ */
   secondPayments: [
      {
         amount: Number,
         paymentDate: Date,
         mode: String,
         transactionId: String,
         proof: { filename: String, path: String },
         status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
         createdAt: { type: Date, default: Date.now }
      }
   ],

   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ClientMaster", ClientMasterSchema);
