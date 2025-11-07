// import-data.cjs
// Script to import JSON data into local PostgreSQL database
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  console.log('✅ Connected to database');

  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, 'replit-data.json'); // Update this path to your JSON file
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('📂 Loaded data from JSON file');
    console.log('Tables found:', Object.keys(data));

    // Import users
    if (data.users && data.users.length > 0) {
      console.log(`\n📥 Importing ${data.users.length} users...`);
      for (const user of data.users) {
        await client.query(
          `INSERT INTO users (id, email, "firstName", "lastName", "profileImageUrl", role, "passwordHash")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             email = EXCLUDED.email,
             "firstName" = EXCLUDED."firstName",
             "lastName" = EXCLUDED."lastName",
             "profileImageUrl" = EXCLUDED."profileImageUrl",
             role = EXCLUDED.role`,
          [user.id, user.email, user.firstName, user.lastName, user.profileImageUrl, user.role, user.passwordHash || null]
        );
      }
      console.log('✅ Users imported');
    }

    // Import properties
    if (data.properties && data.properties.length > 0) {
      console.log(`\n📥 Importing ${data.properties.length} properties...`);
      for (const property of data.properties) {
        await client.query(
          `INSERT INTO properties (id, name, type, location, "totalUnits", "availableUnits", "priceRange", status, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             type = EXCLUDED.type,
             location = EXCLUDED.location,
             "totalUnits" = EXCLUDED."totalUnits",
             "availableUnits" = EXCLUDED."availableUnits",
             "priceRange" = EXCLUDED."priceRange",
             status = EXCLUDED.status,
             "updatedAt" = EXCLUDED."updatedAt"`,
          [property.id, property.name, property.type, property.location, property.totalUnits, 
           property.availableUnits, property.priceRange, property.status, property.createdAt, property.updatedAt]
        );
      }
      console.log('✅ Properties imported');
    }

    // Import clients
    if (data.clients && data.clients.length > 0) {
      console.log(`\n📥 Importing ${data.clients.length} clients...`);
      for (const client_record of data.clients) {
        await client.query(
          `INSERT INTO clients (id, name, email, phone, "panNumber", "aadharNumber", "verificationStatus", "assignedTo", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             email = EXCLUDED.email,
             phone = EXCLUDED.phone,
             "panNumber" = EXCLUDED."panNumber",
             "aadharNumber" = EXCLUDED."aadharNumber",
             "verificationStatus" = EXCLUDED."verificationStatus",
             "assignedTo" = EXCLUDED."assignedTo",
             "updatedAt" = EXCLUDED."updatedAt"`,
          [client_record.id, client_record.name, client_record.email, client_record.phone, 
           client_record.panNumber, client_record.aadharNumber, client_record.verificationStatus, 
           client_record.assignedTo, client_record.createdAt, client_record.updatedAt]
        );
      }
      console.log('✅ Clients imported');
    }

    // Import projects
    if (data.projects && data.projects.length > 0) {
      console.log(`\n📥 Importing ${data.projects.length} projects...`);
      for (const project of data.projects) {
        await client.query(
          `INSERT INTO projects (id, "propertyId", "clientId", "unitNumber", "bookingAmount", "totalAmount", status, "bookingDate", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
             "propertyId" = EXCLUDED."propertyId",
             "clientId" = EXCLUDED."clientId",
             "unitNumber" = EXCLUDED."unitNumber",
             "bookingAmount" = EXCLUDED."bookingAmount",
             "totalAmount" = EXCLUDED."totalAmount",
             status = EXCLUDED.status,
             "bookingDate" = EXCLUDED."bookingDate",
             "updatedAt" = EXCLUDED."updatedAt"`,
          [project.id, project.propertyId, project.clientId, project.unitNumber, 
           project.bookingAmount, project.totalAmount, project.status, project.bookingDate, 
           project.createdAt, project.updatedAt]
        );
      }
      console.log('✅ Projects imported');
    }

    // Import payments
    if (data.payments && data.payments.length > 0) {
      console.log(`\n📥 Importing ${data.payments.length} payments...`);
      for (const payment of data.payments) {
        await client.query(
          `INSERT INTO payments (id, "projectId", amount, "paymentDate", "paymentMethod", status, "transactionId", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
             "projectId" = EXCLUDED."projectId",
             amount = EXCLUDED.amount,
             "paymentDate" = EXCLUDED."paymentDate",
             "paymentMethod" = EXCLUDED."paymentMethod",
             status = EXCLUDED.status,
             "transactionId" = EXCLUDED."transactionId"`,
          [payment.id, payment.projectId, payment.amount, payment.paymentDate, 
           payment.paymentMethod, payment.status, payment.transactionId, payment.createdAt]
        );
      }
      console.log('✅ Payments imported');
    }

    // Import milestones
    if (data.milestones && data.milestones.length > 0) {
      console.log(`\n📥 Importing ${data.milestones.length} milestones...`);
      for (const milestone of data.milestones) {
        await client.query(
          `INSERT INTO milestones (id, "projectId", name, description, "dueDate", status, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
             "projectId" = EXCLUDED."projectId",
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             "dueDate" = EXCLUDED."dueDate",
             status = EXCLUDED.status,
             "updatedAt" = EXCLUDED."updatedAt"`,
          [milestone.id, milestone.projectId, milestone.name, milestone.description, 
           milestone.dueDate, milestone.status, milestone.createdAt, milestone.updatedAt]
        );
      }
      console.log('✅ Milestones imported');
    }

    // Import documents
    if (data.documents && data.documents.length > 0) {
      console.log(`\n📥 Importing ${data.documents.length} documents...`);
      for (const document of data.documents) {
        await client.query(
          `INSERT INTO documents (id, "projectId", name, type, "uploadedBy", "uploadedAt", "fileUrl")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             "projectId" = EXCLUDED."projectId",
             name = EXCLUDED.name,
             type = EXCLUDED.type,
             "uploadedBy" = EXCLUDED."uploadedBy",
             "uploadedAt" = EXCLUDED."uploadedAt",
             "fileUrl" = EXCLUDED."fileUrl"`,
          [document.id, document.projectId, document.name, document.type, 
           document.uploadedBy, document.uploadedAt, document.fileUrl]
        );
      }
      console.log('✅ Documents imported');
    }

    // Import activity logs
    if (data.activity_logs && data.activity_logs.length > 0) {
      console.log(`\n📥 Importing ${data.activity_logs.length} activity logs...`);
      for (const log of data.activity_logs) {
        await client.query(
          `INSERT INTO activity_logs (id, "userId", action, "entityType", "entityId", details, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [log.id, log.userId, log.action, log.entityType, log.entityId, log.details, log.createdAt]
        );
      }
      console.log('✅ Activity logs imported');
    }

    console.log('\n🎉 Data import completed successfully!');

  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

importData().catch(console.error);
