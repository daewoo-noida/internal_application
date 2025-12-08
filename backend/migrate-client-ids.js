// migrate-client-ids.js
const mongoose = require('mongoose');
require('dotenv').config();

async function migrateExistingClients() {
    try {
        console.log('🚀 Starting client ID migration...');

        // Get the MongoDB Atlas URI from .env
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            console.error('❌ MONGODB_URI is not defined in .env file');
            process.exit(1);
        }

        // For debugging - show partial URI (hide password)
        const maskedURI = mongoURI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://***:***@');
        console.log(`Connecting to: ${maskedURI}`);

        // Connect to MongoDB Atlas - remove deprecated options for newer Mongoose
        await mongoose.connect(mongoURI);

        console.log('✅ Connected to MongoDB Atlas successfully');

        // Check connection
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);

        // Try to load the ClientMaster model
        let ClientMaster;
        try {
            // Check if the model is already compiled
            if (mongoose.models.ClientMaster) {
                ClientMaster = mongoose.model('ClientMaster');
                console.log('✅ Using existing ClientMaster model');
            } else {
                // Try to load from models directory
                const fs = require('fs');
                const path = require('path');

                // Look for the model file
                const possiblePaths = [
                    './models/ClientMaster.js',
                    './models/ClientMaster.cjs',
                    '../models/ClientMaster.js',
                    '../models/ClientMaster.cjs'
                ];

                let modelFound = false;
                for (const modelPath of possiblePaths) {
                    try {
                        const fullPath = path.resolve(__dirname, modelPath);
                        if (fs.existsSync(fullPath)) {
                            ClientMaster = require(fullPath);
                            console.log(`✅ Loaded ClientMaster model from: ${modelPath}`);
                            modelFound = true;
                            break;
                        }
                    } catch (err) {
                        continue;
                    }
                }

                if (!modelFound) {
                    console.log('⚠️  Could not find ClientMaster model file, using basic schema');
                    // Create a basic schema
                    const clientSchema = new mongoose.Schema({
                        name: String,
                        email: String,
                        phone: String,
                        clientId: String,
                        createdAt: Date,
                        updatedAt: Date
                    }, { collection: 'clientmasters' }); // Specify collection name

                    ClientMaster = mongoose.model('ClientMaster', clientSchema);
                }
            }
        } catch (error) {
            console.error('❌ Error loading model:', error.message);
            console.log('Using fallback schema...');

            // Fallback schema
            const clientSchema = new mongoose.Schema({
                name: String,
                email: String,
                phone: String,
                clientId: String,
                createdAt: Date,
                updatedAt: Date
            }, { collection: 'clientmasters' });

            ClientMaster = mongoose.model('ClientMaster', clientSchema);
        }

        // Test the connection by counting documents
        try {
            const totalClients = await ClientMaster.countDocuments();
            console.log(`📊 Total clients in database: ${totalClients}`);

            if (totalClients === 0) {
                console.log('⚠️  No clients found in database');
                await mongoose.disconnect();
                return;
            }
        } catch (countError) {
            console.error('❌ Error counting documents:', countError.message);
            console.log('Checking if collection exists...');

            // List all collections
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('Available collections:');
            collections.forEach(col => console.log(`  - ${col.name}`));

            await mongoose.disconnect();
            return;
        }

        // Get all clients without clientId, sorted by creation date
        const clients = await ClientMaster.find({ clientId: { $exists: false } })
            .sort({ createdAt: 1 });

        console.log(`📊 Found ${clients.length} clients without clientId`);

        if (clients.length === 0) {
            console.log('✅ All clients already have clientId assigned');

            // Show current client IDs
            const sampleClients = await ClientMaster.find().sort({ clientId: -1 }).limit(5);
            console.log('\n📋 Latest 5 client IDs:');
            sampleClients.forEach(client => {
                console.log(`  ${client.clientId || 'No ID'} - ${client.name || 'Unnamed'}`);
            });

            await mongoose.disconnect();
            return;
        }

        // Group clients by year of creation
        const clientsByYear = {};
        clients.forEach(client => {
            const year = client.createdAt ? new Date(client.createdAt).getFullYear() : new Date().getFullYear();
            if (!clientsByYear[year]) {
                clientsByYear[year] = [];
            }
            clientsByYear[year].push(client);
        });

        let totalUpdated = 0;

        console.log('\n📅 Processing clients by year:');
        // Process each year separately
        for (const [year, yearClients] of Object.entries(clientsByYear)) {
            console.log(`\n  Year ${year}: ${yearClients.length} clients`);

            // Get existing clientIds for this year to avoid conflicts
            let existingClients = [];
            try {
                existingClients = await ClientMaster.find({
                    clientId: new RegExp(`^DW-\\d+-${year}$`)
                }).sort({ clientId: 1 });
            } catch (error) {
                console.log(`    No existing IDs for ${year} (or regex error)`);
            }

            let nextSequence = 1;
            if (existingClients.length > 0) {
                const lastClient = existingClients[existingClients.length - 1];
                if (lastClient.clientId) {
                    const match = lastClient.clientId.match(/^DW-(\d+)-(\d+)$/);
                    if (match && parseInt(match[2]) === parseInt(year)) {
                        nextSequence = parseInt(match[1]) + 1;
                    }
                }
                console.log(`    Existing IDs for ${year}: ${existingClients.length}, next sequence: ${nextSequence}`);
            }

            // Assign IDs to each client
            for (let i = 0; i < yearClients.length; i++) {
                const client = yearClients[i];
                const clientId = `DW-${String(nextSequence + i).padStart(5, '0')}-${year}`;

                try {
                    const result = await ClientMaster.updateOne(
                        { _id: client._id },
                        {
                            $set: {
                                clientId: clientId,
                                updatedAt: new Date()
                            }
                        }
                    );

                    if (result.modifiedCount > 0) {
                        console.log(`    ✅ ${client.name ? client.name.padEnd(20) : 'Unnamed'.padEnd(20)} -> ${clientId}`);
                        totalUpdated++;
                    } else {
                        console.log(`    ⚠️  ${client.name ? client.name.padEnd(20) : 'Unnamed'.padEnd(20)} not updated`);
                    }
                } catch (error) {
                    console.error(`    ❌ Error updating ${client.name || 'client'}:`, error.message);
                }
            }
        }

        console.log(`\n🎉 Migration completed! Updated ${totalUpdated} clients`);

        // Verify migration
        const clientsWithoutId = await ClientMaster.countDocuments({ clientId: { $exists: false } });
        const totalClients = await ClientMaster.countDocuments();

        console.log('\n🔍 Verification:');
        console.log(`   Total clients in database: ${totalClients}`);
        console.log(`   Clients without ID: ${clientsWithoutId} (should be 0)`);

        if (clientsWithoutId > 0) {
            console.log('⚠️  Warning: Some clients still don\'t have IDs');

            // Show clients still without IDs
            const missingIdClients = await ClientMaster.find({ clientId: { $exists: false } }).limit(5);
            console.log('\nClients still without IDs:');
            missingIdClients.forEach(client => {
                console.log(`  - ${client.name || 'Unnamed'} (ID: ${client._id})`);
            });
        }

        // Show sample of updated clients
        try {
            const sampleClients = await ClientMaster.find().sort({ clientId: -1 }).limit(10);
            console.log('\n📋 Latest 10 client IDs:');
            sampleClients.forEach(client => {
                const dateStr = client.createdAt ? new Date(client.createdAt).toISOString().split('T')[0] : 'Unknown';
                console.log(`  ${client.clientId || 'No ID'} - ${client.name || 'Unnamed'} (${dateStr})`);
            });
        } catch (error) {
            console.log('\n⚠️  Could not fetch sample clients:', error.message);
        }

        console.log('\n✅ Migration script completed successfully!');

        // Close connection properly
        await mongoose.disconnect();
        console.log('🔌 MongoDB connection closed');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);

        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('🔌 MongoDB connection closed due to error');
        }

        process.exit(1);
    }
}

// Handle script termination
process.on('SIGINT', async () => {
    console.log('\n\n⚠️  Migration interrupted by user');
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('🔌 MongoDB connection closed');
    }
    process.exit(0);
});

// Run the migration
migrateExistingClients();