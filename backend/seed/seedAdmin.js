require("dotenv").config({ path: "../.env" }); // <-- IMPORTANT
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");

        const adminEmail = "admin@daewooappliances.com";

        const existing = await User.findOne({ email: adminEmail });
        if (existing) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        const admin = new User({
            name: "Super Admin",
            email: adminEmail,
            phone: "9999999999",
            designation: "admin",
            password: hashedPassword,
            role: "admin",
        });

        await admin.save();

        console.log("Admin created successfully!");
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
