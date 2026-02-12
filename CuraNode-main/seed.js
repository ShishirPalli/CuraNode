const mongoose = require('./backend/node_modules/mongoose');
const dotenv = require('./backend/node_modules/dotenv');
dotenv.config({ path: './backend/.env' });

const User = require('./backend/models/User');
const Patient = require('./backend/models/Patient');
const ClinicalAction = require('./backend/models/ClinicalAction');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/curanode';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Clearing existing data...');
    await User.deleteMany({});
    await Patient.deleteMany({});
    await ClinicalAction.deleteMany({});

    console.log('👥 Creating demo users...');

    const doctor = await User.create({
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'doctor@hospital.com',
      password: 'password123',
      role: 'doctor',
      department: 'Cardiology',
    });

    const nurse = await User.create({
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'nurse@hospital.com',
      password: 'password123',
      role: 'nurse',
      department: 'ICU',
    });

    const pharmacy = await User.create({
      firstName: 'Arjun',
      lastName: 'Singh',
      email: 'pharmacy@hospital.com',
      password: 'password123',
      role: 'pharmacy',
      department: 'Main Pharmacy',
    });

    const labStaff = await User.create({
      firstName: 'Anjali',
      lastName: 'Patel',
      email: 'lab@hospital.com',
      password: 'password123',
      role: 'diagnostic-staff',
      department: 'Lab',
    });

    console.log('👨‍🏥 Creating demo patients...');

    const patient1 = await Patient.create({
      medicalRecordNumber: 'MRN-001',
      firstName: 'Vikram',
      lastName: 'Gupta',
      dateOfBirth: new Date('1965-05-15'),
      gender: 'M',
      bloodType: 'O+',
      phoneNumber: '+91 (555) 123-4567',
      email: 'vikram.gupta@email.com',
      address: 'Mumbai, Maharashtra, India',
      allergies: ['Penicillin'],
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      assignedDoctor: doctor._id,
      status: 'Active',
    });

    const patient2 = await Patient.create({
      medicalRecordNumber: 'MRN-002',
      firstName: 'Neha',
      lastName: 'Desai',
      dateOfBirth: new Date('1978-08-22'),
      gender: 'F',
      bloodType: 'A-',
      phoneNumber: '+91 (555) 234-5678',
      email: 'neha.desai@email.com',
      address: 'Delhi, Delhi, India',
      allergies: [],
      medicalHistory: ['Asthma'],
      assignedDoctor: doctor._id,
      status: 'Active',
    });

    console.log('📋 Creating demo clinical actions...');

    await ClinicalAction.create([
      {
        patientId: patient1._id,
        actionType: 'prescription',
        title: 'Statin Medication',
        description: 'Start Atorvastatin 20mg once daily for cholesterol management',
        status: 'in-progress',
        priority: 'high',
        initiatedBy: doctor._id,
        assignedTo: pharmacy._id,
        departmentAssigned: 'pharmacy',
        details: { medication: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
      },
      {
        patientId: patient1._id,
        actionType: 'diagnostic-request',
        title: 'Blood Work',
        description: 'Complete blood count (CBC), Lipid panel, Glucose level',
        status: 'completed',
        priority: 'high',
        initiatedBy: doctor._id,
        assignedTo: labStaff._id,
        departmentAssigned: 'lab',
        completedAt: new Date(),
        completedBy: labStaff._id,
        completionNotes: 'All tests completed. Results available in patient portal.',
      },
      {
        patientId: patient2._id,
        actionType: 'diagnostic-request',
        title: 'Chest X-Ray',
        description: 'PA and lateral chest X-ray to rule out pneumonia',
        status: 'pending',
        priority: 'medium',
        initiatedBy: doctor._id,
        departmentAssigned: 'imaging',
        details: { views: ['PA', 'Lateral'] },
      },
      {
        patientId: patient2._id,
        actionType: 'care-instruction',
        title: 'Respiratory Therapy',
        description: 'Pulmonary function tests and breathing exercises 3x daily',
        status: 'in-progress',
        priority: 'medium',
        initiatedBy: doctor._id,
        assignedTo: nurse._id,
        departmentAssigned: 'nursing',
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('👨‍⚕️  Doctor: doctor@hospital.com / password123 (Rajesh Kumar)');
    console.log('👩‍⚕️  Nurse: nurse@hospital.com / password123 (Priya Sharma)');
    console.log('💊 Pharmacy: pharmacy@hospital.com / password123 (Arjun Singh)');
    console.log('🔬 Diagnostic Staff: lab@hospital.com / password123 (Anjali Patel)');
    console.log('\n👥 Demo Patients:');
    console.log('Patient 1: Vikram Gupta (MRN-001)');
    console.log('Patient 2: Neha Desai (MRN-002)');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
