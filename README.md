# 🏥 CURANODE
## Patient-Centric Clinical Workflow and Coordination System

CURANODE is a modern healthcare application designed to streamline clinical workflows and coordination for hospitals. Built with the MERN stack and real-time capabilities via Socket.IO, it enables seamless collaboration between doctors, nurses, diagnostic staff, and pharmacy teams.

---

## 🎯 Core Features

### Patient Management
- **Unified Patient Records**: All clinical information organized around a single patient
- **Medical History Tracking**: Comprehensive patient history, medications, and allergies
- **Multi-role Access**: Doctors, nurses, lab staff, and pharmacy can view patient-centric data

### Clinical Actions
- **Create & Route Actions**: Doctors initiate:
  - 💊 Prescriptions
  - 🔬 Diagnostic Requests (Lab/Imaging)
  - 📋 Referrals
  - 📝 Care Instructions
  
- **Status Tracking**: Real-time status updates (Pending → In Progress → Completed)
- **Department Assignment**: Automatic routing to relevant departments
- **Action Timeline**: Chronological view of all clinical activities

### Real-Time Collaboration
- **WebSocket Integration**: Live updates via Socket.IO
- **Instant Notifications**: All departments see updates immediately
- **Role-Based Dashboard**: Customized views for each user role
- **Action Comments**: Add notes and updates to clinical actions

---

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js**: REST API server
- **MongoDB**: NoSQL database for flexible patient records
- **Socket.IO**: Real-time WebSocket communication
- **JWT**: Secure token-based authentication
- **Bcryptjs**: Password hashing

### Frontend
- **React.js**: Component-based UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Socket.IO Client**: Real-time communication
- **CSS**: Custom styling (no heavy UI frameworks for MVP)

### Database
- **MongoDB**: Flexible schema for patient data, actions, and users

---

## 📋 Project Structure

```
CuraNode/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model (doctors, nurses, pharmacists, etc.)
│   │   ├── Patient.js       # Patient model with medical information
│   │   └── ClinicalAction.js # Clinical action model (prescriptions, diagnostics, etc.)
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── patientController.js  # Patient CRUD operations
│   │   └── actionController.js   # Clinical action management
│   ├── routes/
│   │   ├── auth.js      # Authentication endpoints
│   │   ├── patients.js  # Patient endpoints
│   │   └── actions.js   # Action endpoints
│   ├── middleware/
│   │   └── auth.js      # JWT verification & role-based access
│   ├── sockets/
│   │   └── socketHandler.js  # WebSocket event handlers
│   ├── server.js        # Express server setup
│   ├── package.json
│   └── .env             # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PatientDetail.js
│   │   │   └── CreatePatient.js
│   │   ├── components/
│   │   │   └── (shared components)
│   │   ├── utils/
│   │   │   ├── api.js          # API calls configuration
│   │   │   ├── socket.js       # Socket.IO client setup
│   │   │   └── AuthContext.js  # Auth state management
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── seed.js              # Database seeding script
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation & Setup

#### 1. **Clone/Setup Project**
```bash
cd c:\Users\palli\OneDrive\Desktop\CuraNode
```

#### 2. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# The .env file is already configured with:
# MONGODB_URI=mongodb://localhost:27017/curanode
# JWT_SECRET=your_super_secret_jwt_key_change_in_production
# PORT=5000
# NODE_ENV=development
```

#### 3. **Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install

# The .env file is already configured with:
# REACT_APP_API_URL=http://localhost:5000/api
```

#### 4. **Seed Demo Data** (Optional but recommended)
```bash
# From project root
cd backend
npm install  # Ensure dependencies are installed

# From project root
node ../seed.js

# Output:
# ✅ Database seeded successfully!
# Demo Credentials:
# 👨‍⚕️  Doctor: doctor@hospital.com / password123
# 👩‍⚕️  Nurse: nurse@hospital.com / password123
# 💊 Pharmacy: pharmacy@hospital.com / password123
# 🔬 Lab Staff: lab@hospital.com / password123
```

---

## 🏃 Running the Application

### Start MongoDB
For local MongoDB:
```bash
# Windows
mongod

# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Start Backend Server
```bash
cd backend
npm run dev

# Output should show:
# ✅ MongoDB connected
# 🚀 Server running on port 5000
# 📡 WebSocket server ready for connections
```

### Start Frontend (New Terminal)
```bash
cd frontend
npm start

# Automatically opens http://localhost:3000
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## 🔐 Demo Accounts

Use these credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| 👨‍⚕️ Doctor | doctor@hospital.com | password123 |
| 👩‍⚕️ Nurse | nurse@hospital.com | password123 |
| 💊 Pharmacy | pharmacy@hospital.com | password123 |
| 🔬 Diagnostic Staff | lab@hospital.com | password123 |

---

## 📊 Key Workflows

### 1️⃣ Doctor Creates Patient
1. Doctor logs in → Dashboard
2. Clicks "Create Patient"
3. Fills in patient details
4. Patient appears in doctor's patient list

### 2️⃣ Doctor Initiates Clinical Action
1. Doctor views patient details
2. Clicks "New Clinical Action"
3. Fills in: Title, Description, Action Type, Priority, Department
4. Action routed to relevant department

### 3️⃣ Department Receives & Updates Action
1. Department user (Pharmacy/Lab/Nursing) logs in
2. Dashboard shows all pending actions for that department
3. Staff member updates status: Pending → In Progress → Completed
4. All users viewing patient see real-time update via WebSocket

### 4️⃣ Real-Time Updates
- As status changes, Socket.IO emits event
- Patient detail page updates instantly
- Department dashboard refreshes
- No page reload needed

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user (protected)
```

### Patients
```
GET    /api/patients            - Get all patients
GET    /api/patients/:id        - Get patient details
POST   /api/patients            - Create patient (doctor only)
PUT    /api/patients/:id        - Update patient
DELETE /api/patients/:id        - Delete patient (doctor only)
```

### Clinical Actions
```
POST   /api/actions             - Create action (doctor only)
GET    /api/actions             - Get actions (role-based filter)
GET    /api/actions/patient/:id - Get actions for specific patient
GET    /api/actions/:id         - Get action details
PUT    /api/actions/:id/status  - Update action status
POST   /api/actions/:id/notes   - Add note to action
```

---

## 🔌 WebSocket Events

### Client → Server
```javascript
// Join patient room for real-time updates
socket.emit('join-patient', patientId);

// Join role-based dashboard
socket.emit('join-role-room');

// Leave patient room
socket.emit('leave-patient', patientId);
```

### Server → Client
```javascript
// Action was updated
socket.on('action-updated', (action) => { ... });

// Action status changed
socket.on('action-status-changed', ({ actionId, newStatus, timestamp }) => { ... });
```

---

## 💾 Database Models

### User Schema
```javascript
{
  firstName, lastName,
  email (unique),
  password (hashed),
  role: ['doctor', 'nurse', 'diagnostic-staff', 'pharmacy'],
  department,
  isActive
}
```

### Patient Schema
```javascript
{
  medicalRecordNumber (unique),
  firstName, lastName,
  dateOfBirth,
  gender,
  bloodType,
  phoneNumber, email, address,
  allergies: [String],
  currentMedications: [{ medicationName, dosage, frequency }],
  medicalHistory: [String],
  assignedDoctor (reference to User),
  status: ['Active', 'Discharged', 'Admitted']
}
```

### ClinicalAction Schema
```javascript
{
  patientId (reference to Patient),
  actionType: ['prescription', 'diagnostic-request', 'referral', 'care-instruction'],
  title, description,
  status: ['pending', 'in-progress', 'completed', 'cancelled'],
  priority: ['low', 'medium', 'high', 'urgent'],
  initiatedBy (reference to User),
  assignedTo (reference to User),
  departmentAssigned: ['lab', 'imaging', 'pharmacy', 'nursing'],
  details: {},
  notes: [{ userId, note, createdAt }],
  completedAt, completedBy,
  completionNotes
}
```

---

## 🧪 Testing the Demo

### Test Doctor → Pharmacy Flow

1. **Login as Doctor**
   - Email: doctor@hospital.com
   - Password: password123

2. **Create a Prescription Action**
   - Go to a patient's detail page
   - Click "New Clinical Action"
   - Type: Prescription
   - Department: Pharmacy
   - Add description

3. **Login as Pharmacy (New Browser Tab)**
   - Email: pharmacy@hospital.com
   - Password: password123
   - See the new prescription in dashboard

4. **Update Status**
   - Change status from "Pending" → "In Progress"
   - Switch back to doctor's tab
   - See real-time update without refresh

---

## 🤝 Contribution Guidelines

- Keep components focused and reusable
- Add meaningful comments for complex logic
- Follow folder structure conventions
- Test features across different roles

---

## 📝 Notes

- This is an MVP designed for hackathons and quick deployment
- Not suitable for production without additional security measures
- Change JWT_SECRET in .env before deployment
- Implement proper error handling and logging for production
- Add comprehensive input validation
- Implement rate limiting on API endpoints
- Add audit logs for all clinical actions

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
✓ Ensure MongoDB is running
✓ Check MONGODB_URI in .env
✓ Try: mongod in a separate terminal
```

### WebSocket Connection Error
```
✓ Ensure backend is running on port 5000
✓ Check browser console for errors
✓ Verify CORS settings in server.js
```

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules
npm install
```

---

## 📚 Resources

- [Node.js Documentation](https://nodejs.org)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React.js Documentation](https://react.dev)
- [Socket.IO Documentation](https://socket.io)
- [JWT Basics](https://jwt.io)

---

## 📄 License

This project is provided as-is for educational and hackathon purposes.

---

**Last Updated**: February 2026  
**Version**: 1.0.0 MVP  
**Status**: ✅ Ready for demo
