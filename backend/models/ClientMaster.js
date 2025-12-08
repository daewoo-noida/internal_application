const mongoose = require("mongoose");

const ClientMasterSchema = new mongoose.Schema({
   clientId: {
      type: String,
      unique: true
   },
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
   franchiseType: { type: String },

   franchiseState: { type: String },
   franchiseDistrict: { type: String },
   franchiseCity: { type: String },
   franchisePin: { type: String },

   territory: { type: String },

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
   paymentImage: { filename: String, path: String },
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

   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now }
});

ClientMasterSchema.pre('save', async function (next) {
   try {
      // Only generate clientId if it doesn't exist
      if (!this.clientId) {
         const year = new Date().getFullYear();
         const prefix = "DW";

         // Find the latest client for this year with the same prefix
         const latestClient = await mongoose.model('ClientMaster')
            .findOne({
               clientId: new RegExp(`^${prefix}-\\d+-${year}$`)
            })
            .sort({ clientId: -1 });

         let sequenceNumber = 1;

         if (latestClient && latestClient.clientId) {
            // Extract sequence number from existing clientId
            const match = latestClient.clientId.match(new RegExp(`^${prefix}-(\\d+)-(\\d+)$`));
            if (match && parseInt(match[2]) === year) {
               sequenceNumber = parseInt(match[1]) + 1;
            }
         }

         // Format: DW-00001-2024
         this.clientId = `${prefix}-${String(sequenceNumber).padStart(5, '0')}-${year}`;
      }

      // Always update the updatedAt timestamp
      this.updatedAt = new Date();

      // Call next() to continue the save process
      if (next && typeof next === 'function') {
         next();
      }
   } catch (error) {
      console.error('Error generating clientId:', error);
      // Call next with error if provided
      if (next && typeof next === 'function') {
         next(error);
      }
   }
});

// Alternative: If you're using Mongoose v6+, you can use async/await without next
ClientMasterSchema.pre('save', async function () {
   try {
      // Only generate clientId if it doesn't exist
      if (!this.clientId) {
         const year = new Date().getFullYear();
         const prefix = "DW";

         // Find the latest client for this year with the same prefix
         const latestClient = await mongoose.model('ClientMaster')
            .findOne({
               clientId: new RegExp(`^${prefix}-\\d+-${year}$`)
            })
            .sort({ clientId: -1 });

         let sequenceNumber = 1;

         if (latestClient && latestClient.clientId) {
            // Extract sequence number from existing clientId
            const match = latestClient.clientId.match(new RegExp(`^${prefix}-(\\d+)-(\\d+)$`));
            if (match && parseInt(match[2]) === year) {
               sequenceNumber = parseInt(match[1]) + 1;
            }
         }

         // Format: DW-00001-2024
         this.clientId = `${prefix}-${String(sequenceNumber).padStart(5, '0')}-${year}`;
      }

      // Always update the updatedAt timestamp
      this.updatedAt = new Date();
   } catch (error) {
      console.error('Error generating clientId:', error);
      // Fallback ID in case of error
      this.clientId = `DW-${Date.now().toString().slice(-5)}-${new Date().getFullYear()}`;
   }
});

module.exports = mongoose.model("ClientMaster", ClientMasterSchema);