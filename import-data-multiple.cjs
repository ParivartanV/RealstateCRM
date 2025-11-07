// import-data-multiple.cjs
// Script to import JSON data from multiple files into local PostgreSQL database
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
    const dataDir = path.join(__dirname, 'attached_assets', 'data');
    console.log(`📂 Reading JSON files from: ${dataDir}\n`);

    // Helper function to read JSON file if it exists
    const readJsonFile = (filename) => {
      const filePath = path.join(dataDir, filename);
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      return null;
    };

    // Import users
    const users = readJsonFile('users.json');
    if (users && users.length > 0) {
      console.log(`📥 Importing ${users.length} users...`);
      for (const user of users) {
        await client.query(
          `INSERT INTO users (id, email, first_name, last_name, profile_image_url, role, password_hash, phone, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO UPDATE SET
             email = EXCLUDED.email,
             first_name = EXCLUDED.first_name,
             last_name = EXCLUDED.last_name,
             profile_image_url = EXCLUDED.profile_image_url,
             role = EXCLUDED.role,
             phone = EXCLUDED.phone,
             status = EXCLUDED.status`,
          [user.id, user.email, user.firstName, user.lastName, user.profileImageUrl, user.role, user.passwordHash || null, user.phone || null, user.status || 'active']
        );
      }
      console.log('✅ Users imported');
    }

    // Import projects
    const projects = readJsonFile('projects.json');
    if (projects && projects.length > 0) {
      console.log(`\n📥 Importing ${projects.length} projects...`);
      for (const project of projects) {
        await client.query(
          `INSERT INTO projects (id, name, location, status, total_units, completion_percentage, description, amenities, image_url, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             location = EXCLUDED.location,
             status = EXCLUDED.status,
             total_units = EXCLUDED.total_units,
             completion_percentage = EXCLUDED.completion_percentage,
             description = EXCLUDED.description,
             amenities = EXCLUDED.amenities,
             image_url = EXCLUDED.image_url,
             updated_at = EXCLUDED.updated_at`,
          [project.id, project.name, project.location, project.status || 'planned', project.totalUnits || 0,
           project.completionPercentage || 0, project.description || null, project.amenities || null,
           project.imageUrl || null, project.createdAt || new Date().toISOString(), project.updatedAt || new Date().toISOString()]
        );
      }
      console.log('✅ Projects imported');
    }

    // Import buildings
    const buildings = readJsonFile('buildings.json');
    if (buildings && buildings.length > 0) {
      console.log(`\n📥 Importing ${buildings.length} buildings...`);
      let skipped = 0;
      for (const building of buildings) {
        if (!building.projectId) {
          console.warn(`⚠️  Skipping building ${building.id || building.name} - missing project_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO buildings (id, project_id, name, total_floors, created_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO UPDATE SET
               project_id = EXCLUDED.project_id,
               name = EXCLUDED.name,
               total_floors = EXCLUDED.total_floors`,
            [building.id, building.projectId, building.name, building.totalFloors, building.createdAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing building ${building.id || building.name}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Buildings imported (${skipped} skipped)`);
    }

    // Import floors
    const floors = readJsonFile('floors.json');
    if (floors && floors.length > 0) {
      console.log(`\n📥 Importing ${floors.length} floors...`);
      let skipped = 0;
      for (const floor of floors) {
        if (!floor.buildingId) {
          console.warn(`⚠️  Skipping floor ${floor.id || floor.name} - missing building_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO floors (id, building_id, floor_number, name, created_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO UPDATE SET
               building_id = EXCLUDED.building_id,
               floor_number = EXCLUDED.floor_number,
               name = EXCLUDED.name`,
            [floor.id, floor.buildingId, floor.floorNumber, floor.name, floor.createdAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing floor ${floor.id || floor.name}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Floors imported (${skipped} skipped)`);
    }

    // Import properties
    const properties = readJsonFile('properties.json');
    if (properties && properties.length > 0) {
      console.log(`\n📥 Importing ${properties.length} properties...`);
      let skipped = 0;
      for (const property of properties) {
        if (!property.floorId || !property.projectId) {
          console.warn(`⚠️  Skipping property ${property.id || property.unitNumber} - missing floor_id or project_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO properties (id, floor_id, project_id, unit_number, bhk, area, price, status, image_url, client_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (id) DO UPDATE SET
               floor_id = EXCLUDED.floor_id,
               project_id = EXCLUDED.project_id,
               unit_number = EXCLUDED.unit_number,
               bhk = EXCLUDED.bhk,
               area = EXCLUDED.area,
               price = EXCLUDED.price,
               status = EXCLUDED.status,
               image_url = EXCLUDED.image_url,
               client_id = EXCLUDED.client_id,
               updated_at = EXCLUDED.updated_at`,
            [property.id, property.floorId, property.projectId, property.unitNumber, property.bhk || '2BHK',
             property.area || 1000, property.price, property.status || 'available', property.imageUrl || null,
             property.clientId || null, property.createdAt || new Date().toISOString(), property.updatedAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing property ${property.id || property.unitNumber}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Properties imported (${skipped} skipped)`);
    }

    // Import clients
    const clients = readJsonFile('clients.json');
    if (clients && clients.length > 0) {
      console.log(`\n📥 Importing ${clients.length} clients...`);
      let skipped = 0;
      for (const client_record of clients) {
        try {
          await client.query(
            `INSERT INTO clients (id, user_id, name, email, phone, location, status, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (id) DO UPDATE SET
               user_id = EXCLUDED.user_id,
               name = EXCLUDED.name,
               email = EXCLUDED.email,
               phone = EXCLUDED.phone,
               location = EXCLUDED.location,
               status = EXCLUDED.status,
               updated_at = EXCLUDED.updated_at`,
            [client_record.id, client_record.userId || null, client_record.name, client_record.email, 
             client_record.phone, client_record.location || null, client_record.status || 'active',
             client_record.createdAt || new Date().toISOString(), client_record.updatedAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing client ${client_record.id || client_record.name}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Clients imported (${skipped} skipped)`);
    }

    // Import payments
    const payments = readJsonFile('payments.json');
    if (payments && payments.length > 0) {
      console.log(`\n📥 Importing ${payments.length} payments...`);
      let skipped = 0;
      for (const payment of payments) {
        if (!payment.propertyId || !payment.clientId) {
          console.warn(`⚠️  Skipping payment ${payment.id} - missing property_id or client_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO payments (id, property_id, client_id, milestone, due_date, amount, paid_amount, status, payment_date, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (id) DO UPDATE SET
               property_id = EXCLUDED.property_id,
               client_id = EXCLUDED.client_id,
               milestone = EXCLUDED.milestone,
               due_date = EXCLUDED.due_date,
               amount = EXCLUDED.amount,
               paid_amount = EXCLUDED.paid_amount,
               status = EXCLUDED.status,
               payment_date = EXCLUDED.payment_date,
               updated_at = EXCLUDED.updated_at`,
            [payment.id, payment.propertyId, payment.clientId, payment.milestone, payment.dueDate,
             payment.amount, payment.paidAmount || 0, payment.status || 'pending', payment.paymentDate || null,
             payment.createdAt || new Date().toISOString(), payment.updatedAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing payment ${payment.id}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Payments imported (${skipped} skipped)`);
    }

    // Import milestones
    const milestones = readJsonFile('milestones.json');
    if (milestones && milestones.length > 0) {
      console.log(`\n📥 Importing ${milestones.length} milestones...`);
      let skipped = 0;
      for (const milestone of milestones) {
        if (!milestone.projectId) {
          console.warn(`⚠️  Skipping milestone ${milestone.id || milestone.name} - missing project_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO milestones (id, project_id, name, description, target_date, completion_date, status, completion_percentage, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO UPDATE SET
               project_id = EXCLUDED.project_id,
               name = EXCLUDED.name,
               description = EXCLUDED.description,
               target_date = EXCLUDED.target_date,
               completion_date = EXCLUDED.completion_date,
               status = EXCLUDED.status,
               completion_percentage = EXCLUDED.completion_percentage,
               updated_at = EXCLUDED.updated_at`,
            [milestone.id, milestone.projectId, milestone.name, milestone.description, milestone.targetDate,
             milestone.completionDate || null, milestone.status || 'not_started', milestone.completionPercentage || 0,
             milestone.createdAt || new Date().toISOString(), milestone.updatedAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing milestone ${milestone.id || milestone.name}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Milestones imported (${skipped} skipped)`);
    }

    // Import documents
    const documents = readJsonFile('documents.json');
    if (documents && documents.length > 0) {
      console.log(`\n📥 Importing ${documents.length} documents...`);
      let skipped = 0;
      for (const document of documents) {
        if (!document.createdById) {
          console.warn(`⚠️  Skipping document ${document.id || document.name} - missing created_by_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO documents (id, name, type, version, status, file_size, file_url, content, property_id, client_id, created_by_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (id) DO UPDATE SET
               name = EXCLUDED.name,
               type = EXCLUDED.type,
               version = EXCLUDED.version,
               status = EXCLUDED.status,
               file_size = EXCLUDED.file_size,
               file_url = EXCLUDED.file_url,
               content = EXCLUDED.content,
               property_id = EXCLUDED.property_id,
               client_id = EXCLUDED.client_id,
               created_by_id = EXCLUDED.created_by_id,
               updated_at = EXCLUDED.updated_at`,
            [document.id, document.name, document.type, document.version || '1.0', document.status || 'draft',
             document.fileSize || null, document.fileUrl || null, document.content || null, document.propertyId || null,
             document.clientId || null, document.createdById, document.createdAt || new Date().toISOString(), document.updatedAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing document ${document.id || document.name}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Documents imported (${skipped} skipped)`);
    }

    // Import bookings
    const bookings = readJsonFile('bookings.json');
    if (bookings && bookings.length > 0) {
      console.log(`\n📥 Importing ${bookings.length} bookings...`);
      let skipped = 0;
      for (const booking of bookings) {
        if (!booking.propertyId || !booking.clientId || !booking.createdById) {
          console.warn(`⚠️  Skipping booking ${booking.id || booking.bookingNumber} - missing required foreign key`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO bookings (id, booking_number, property_id, client_id, full_name, father_spouse_name, 
             occupation, date_of_birth, gender, permanent_address, residential_address, correspondence_address, 
             aadhaar_number, pan_number, phone, email, booking_date, booking_amount, payment_mode, 
             payment_reference_number, created_by_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
             ON CONFLICT (id) DO UPDATE SET
               booking_number = EXCLUDED.booking_number,
               property_id = EXCLUDED.property_id,
               client_id = EXCLUDED.client_id,
               full_name = EXCLUDED.full_name,
               father_spouse_name = EXCLUDED.father_spouse_name,
               occupation = EXCLUDED.occupation,
               date_of_birth = EXCLUDED.date_of_birth,
               gender = EXCLUDED.gender,
               permanent_address = EXCLUDED.permanent_address,
               residential_address = EXCLUDED.residential_address,
               correspondence_address = EXCLUDED.correspondence_address,
               aadhaar_number = EXCLUDED.aadhaar_number,
               pan_number = EXCLUDED.pan_number,
               phone = EXCLUDED.phone,
               email = EXCLUDED.email,
               booking_date = EXCLUDED.booking_date,
               booking_amount = EXCLUDED.booking_amount,
               payment_mode = EXCLUDED.payment_mode,
               payment_reference_number = EXCLUDED.payment_reference_number,
               updated_at = EXCLUDED.updated_at`,
            [booking.id, booking.bookingNumber, booking.propertyId, booking.clientId, booking.fullName,
             booking.fatherSpouseName, booking.occupation || null, booking.dateOfBirth || null, 
             booking.gender || null, booking.permanentAddress, booking.residentialAddress, 
             booking.correspondenceAddress, booking.aadhaarNumber, booking.panNumber, booking.phone, 
             booking.email, booking.bookingDate, booking.bookingAmount, booking.paymentMode, 
             booking.paymentReferenceNumber || null, booking.createdById, booking.createdAt || new Date().toISOString(), booking.updatedAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing booking ${booking.id || booking.bookingNumber}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Bookings imported (${skipped} skipped)`);
    }

    // Import co-applicants
    const coApplicants = readJsonFile('co_applicants.json');
    if (coApplicants && coApplicants.length > 0) {
      console.log(`\n📥 Importing ${coApplicants.length} co-applicants...`);
      let skipped = 0;
      for (const coApplicant of coApplicants) {
        if (!coApplicant.bookingId) {
          console.warn(`⚠️  Skipping co-applicant ${coApplicant.id || coApplicant.fullName} - missing booking_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO co_applicants (id, booking_id, full_name, father_spouse_name, occupation, 
             date_of_birth, gender, permanent_address, residential_address, correspondence_address, 
             aadhaar_number, pan_number, phone, email, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             ON CONFLICT (id) DO UPDATE SET
               booking_id = EXCLUDED.booking_id,
               full_name = EXCLUDED.full_name,
               father_spouse_name = EXCLUDED.father_spouse_name,
               occupation = EXCLUDED.occupation,
               date_of_birth = EXCLUDED.date_of_birth,
               gender = EXCLUDED.gender,
               permanent_address = EXCLUDED.permanent_address,
               residential_address = EXCLUDED.residential_address,
               correspondence_address = EXCLUDED.correspondence_address,
               aadhaar_number = EXCLUDED.aadhaar_number,
               pan_number = EXCLUDED.pan_number,
               phone = EXCLUDED.phone,
               email = EXCLUDED.email`,
            [coApplicant.id, coApplicant.bookingId, coApplicant.fullName, coApplicant.fatherSpouseName,
             coApplicant.occupation || null, coApplicant.dateOfBirth || null, coApplicant.gender || null,
             coApplicant.permanentAddress, coApplicant.residentialAddress, coApplicant.correspondenceAddress,
             coApplicant.aadhaarNumber, coApplicant.panNumber, coApplicant.phone, coApplicant.email, 
             coApplicant.createdAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing co-applicant ${coApplicant.id || coApplicant.fullName}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Co-applicants imported (${skipped} skipped)`);
    }

    // Import booking documents
    const bookingDocuments = readJsonFile('booking_documents.json');
    if (bookingDocuments && bookingDocuments.length > 0) {
      console.log(`\n📥 Importing ${bookingDocuments.length} booking documents...`);
      let skipped = 0;
      for (const doc of bookingDocuments) {
        if (!doc.bookingId) {
          console.warn(`⚠️  Skipping booking document ${doc.id || doc.fileName} - missing booking_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO booking_documents (id, booking_id, co_applicant_id, document_type, file_name, 
             file_url, file_size, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO UPDATE SET
               booking_id = EXCLUDED.booking_id,
               co_applicant_id = EXCLUDED.co_applicant_id,
               document_type = EXCLUDED.document_type,
               file_name = EXCLUDED.file_name,
               file_url = EXCLUDED.file_url,
               file_size = EXCLUDED.file_size`,
            [doc.id, doc.bookingId, doc.coApplicantId || null, doc.documentType, doc.fileName,
             doc.fileUrl, doc.fileSize || null, doc.createdAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing booking document ${doc.id || doc.fileName}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Booking documents imported (${skipped} skipped)`);
    }
    
    // Import activity logs
    const activityLogs = readJsonFile('activity_logs.json');
    if (activityLogs && activityLogs.length > 0) {
      console.log(`\n📥 Importing ${activityLogs.length} activity logs...`);
      let skipped = 0;
      for (const log of activityLogs) {
        if (!log.userId) {
          console.warn(`⚠️  Skipping activity log ${log.id} - missing user_id`);
          skipped++;
          continue;
        }
        try {
          await client.query(
            `INSERT INTO activity_logs (id, user_id, action_type, entity_type, entity_id, entity_name, description, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [log.id, log.userId, log.actionType || log.action, log.entityType, log.entityId, 
             log.entityName || null, log.description || log.details, log.createdAt || new Date().toISOString()]
          );
        } catch (error) {
          console.warn(`⚠️  Error importing activity log ${log.id}: ${error.message}`);
          skipped++;
        }
      }
      console.log(`✅ Activity logs imported (${skipped} skipped)`);
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
