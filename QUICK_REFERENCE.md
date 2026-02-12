# 📖 CURANODE - Developer Quick Reference

## 🎯 Project Overview

CURANODE is a **patient-centric clinical workflow system** that enables real-time collaboration between healthcare professionals.

### Key Concept
- **Everything revolves around a single patient**
- Doctors create clinical actions (prescriptions, diagnostics, etc.)
- Actions are routed to relevant departments
- All changes are visible to everyone in real-time

---

## 🏗️ Architecture

### Frontend → Backend → Database Flow

```
React UI (Port 3000)
    ↓
Express API (Port 5000)
    ↓
MongoDB (Port 27017)
    ↓
Socket.IO (Real-time WebSocket)
```

---

## 👥 User Roles & Permissions

| Role | Create Patients | Create Actions | Update Actions | View All |
|------|---|---|---|---|
| 👨‍⚕️ Doctor | ✅ | ✅ | ✅ | Own patients |
| 👩‍⚕️ Nurse | ❌ | ❌ | ✅ | Nursing tasks |
| 💊 Pharmacy | ❌ | ❌ | ✅ | Pharmacy tasks |
| 🔬 Diagnostic Staff | ❌ | ❌ | ✅ | Lab/Imaging tasks |

---

## 📁 Key Files & Responsibilities

### Backend Structure
```
backend/
├── server.js                  # Express setup, MongoDB connection, Socket.IO
├── models/
│   ├── User.js               # Authentication, roles
│   ├── Patient.js            # Patient medical information
│   └── ClinicalAction.js     # Prescriptions, diagnostics, etc.
├── controllers/
│   ├── authController.js     # Login, register, JWT tokens
│   ├── patientController.js  # CRUD operations for patients
│   └── actionController.js   # CRUD & WebSocket events for actions
├── routes/
│   ├── auth.js               # POST /login, /register, GET /me
│   ├── patients.js           # CRUD endpoints
│   └── actions.js            # Action CRUD + notes
├── middleware/
│   └── auth.js               # JWT verification, role-based access control
└── sockets/
    └── socketHandler.js      # WebSocket rooms & event emission
```

### Frontend Structure
```
frontend/src/
├── App.js                     # Main router, navigation bar
├── pages/
│   ├── Login.js              # Authentication form
│   ├── Register.js           # User registration
│   ├── Dashboard.js          # Role-based dashboard view
│   ├── PatientDetail.js      # Patient info + clinical timeline
│   └── CreatePatient.js      # New patient form
├── utils/
│   ├── api.js                # Axios configuration & API calls
│   ├── socket.js             # Socket.IO client setup
│   └── AuthContext.js        # React context for global auth state
└── styles/
    └── index.css             # Global styling
```

---

## 🔄 Main Data Flow

### 1. Doctor Creates Patient
```
Doctor → Create Patient Form
       ↓
POST /api/patients (with doctorId)
       ↓
Patient created in MongoDB
       ↓
Doctor's dashboard refreshes
       ↓
Patient visible to doctor
```

### 2. Doctor Creates Clinical Action
```
Doctor → Patient Detail → New Action Form
       ↓
POST /api/actions (actionType, departmentAssigned)
       ↓
Action stored in MongoDB
       ↓
Socket.IO emits 'action-updated'
       ↓
All users viewing that patient see update
Department dashboard shows new pending task
```

### 3. Department Updates Action Status
```
Department Staff → Dashboard → Select Action
                ↓
PUT /api/actions/:id/status (status='in-progress')
       ↓
Status updated in MongoDB
       ↓
Socket.IO emits to patient room & role room
       ↓
Doctor sees status change in real-time
Department dashboard updates automatically
```

---

## 🔌 API Quick Reference

### Authentication
```javascript
POST /api/auth/register
{ firstName, lastName, email, password, role, department }

POST /api/auth/login
{ email, password }
// Returns: { token, user }

GET /api/auth/me
// Requires: Authorization header with token
```

### Patients
```javascript
GET /api/patients                    // List (filtered by role)
POST /api/patients                   // Create (doctor only)
GET /api/patients/:id                // Get single patient
PUT /api/patients/:id                // Update patient
DELETE /api/patients/:id             // Delete (doctor only)
```

### Clinical Actions
```javascript
POST /api/actions                    // Create action (doctor only)
// { patientId, actionType, title, description, departmentAssigned, ... }

GET /api/actions                     // List (role-filtered)
GET /api/actions/patient/:patientId  // Get patient's actions
GET /api/actions/:id                 // Get action details

PUT /api/actions/:id/status          // Update status
// { status, completionNotes (optional) }

POST /api/actions/:id/notes          // Add note
// { note: "string" }
```

---

## 🔗 Socket.IO Rooms

### Room Structure
```javascript
// Patient Room (multiple users viewing same patient)
patient-{patientId}
// When you update an action, all users in patient-123 get updated

// Role Room (all users of same role in dashboard)
role-doctor
role-pharmacy
role-nurse
// Filtered by department for diagnostics
```

### Key Events
```javascript
// Client → Server
socket.emit('join-patient', patientId)
socket.emit('join-role-room')
socket.emit('leave-patient', patientId)

// Server → Client
socket.on('action-updated', (action) => { })
socket.on('action-status-changed', ({ actionId, newStatus }) => { })
```

---

## 🔐 Authentication Flow

### Token-Based Auth
```javascript
// 1. User logs in
POST /api/auth/login → {token, user}

// 2. Token stored in localStorage
localStorage.setItem('token', token)

// 3. Every API request includes token
Authorization: Bearer {token}

// 4. Backend verifies token
JWT.decode(token, SECRET) → userId

// 5. Get user from database
User.findById(userId) → attach to req.user
```

### Role-Based Access Control
```javascript
// Middleware checks user role
router.post('/patients',
  roleMiddleware(['doctor']), // Only doctors
  patientController.createPatient
)
```

---

## 🧪 Testing Scenario

### Complete Workflow Test
1. **Doctor (Browser 1)**
   - Login: doctor@hospital.com / password123
   - See: List of assigned patients
   - Click on patient → See timeline
   - Create new action: Type = "Diagnostic Request", Dept = "Lab"

2. **Lab Staff (Browser 2)**
   - Login: lab@hospital.com / password123
   - See: New diagnostic request in dashboard
   - Click action → Change status "Pending" → "In Progress"

3. **Doctor (Browser 1)**
   - Watch the timeline
   - See status update **in real-time** (WebSocket!)
   - No page refresh needed

---

## 📊 Database Schema Summary

### User
```javascript
{
  firstName, lastName,
  email (unique),
  password (hashed),
  role: 'doctor' | 'nurse' | 'diagnostic-staff' | 'pharmacy',
  department,
  isActive,
  createdAt, updatedAt
}
```

### Patient
```javascript
{
  medicalRecordNumber (unique),
  firstName, lastName,
  dateOfBirth,
  gender,
  bloodType,
  phoneNumber, email, address,
  allergies: [String],
  currentMedications: [{medicationName, dosage, frequency}],
  medicalHistory: [String],
  assignedDoctor: ObjectId (ref: User),
  status: 'Active' | 'Discharged' | 'Admitted',
  createdAt, updatedAt
}
```

### ClinicalAction
```javascript
{
  patientId: ObjectId (ref: Patient),
  actionType: 'prescription' | 'diagnostic-request' | 'referral' | 'care-instruction',
  title, description,
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  initiatedBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  departmentAssigned: 'lab' | 'imaging' | 'pharmacy' | 'nursing',
  details: {},
  notes: [{userId: ObjectId, note: String, createdAt}],
  completedAt,
  completedBy: ObjectId,
  completionNotes,
  createdAt, updatedAt
}
```

---

## 🚨 Common Implementation Patterns

### Making API Calls
```javascript
import { patients, actions } from '../utils/api';

// Get all patients
const response = await patients.getAll();
const patientList = response.data;

// Create action
const newAction = await actions.create({
  patientId: '123',
  title: 'Blood Test',
  description: '...',
  departmentAssigned: 'lab'
});
```

### Real-Time Updates
```javascript
import { joinPatientRoom, onActionUpdate, getSocket } from '../utils/socket';

// Join room
useEffect(() => {
  joinPatientRoom(patientId);
  
  // Listen for updates
  onActionUpdate((updatedAction) => {
    setActions(prev => 
      prev.map(a => a._id === updatedAction._id ? updatedAction : a)
    );
  });
  
  return () => leavePatientRoom(patientId);
}, [patientId]);
```

### Protected Routes
```javascript
// Only authenticated users can access
<Route
  path="/patient/:id"
  element={
    <ProtectedRoute>
      <PatientDetail />
    </ProtectedRoute>
  }
/>
```

---

## 🔄 State Management

### Global Auth State (React Context)
```javascript
const { user, isAuthenticated, login, logout } = useAuth();

// Auto-login on page load if token exists
// Auto-connect to Socket.IO after login
// Logout clears token & disconnects socket
```

### Local Component State
```javascript
// Patient list
const [patients, setPatients] = useState([])

// Real-time action updates
const [actions, setActions] = useState([])

// Form submissions
const [formData, setFormData] = useState({...})
```

---

## ⚡ Performance Tips

1. **Pagination** - Implement for large patient lists
2. **Lazy Loading** - Load actions on scroll
3. **Memoization** - Use `React.memo()` for action cards
4. **Debouncing** - Debounce search/filter inputs
5. **Caching** - Cache frequently accessed patient data

---

## 📝 Development Checklist

- [ ] MongoDB running locally or Atlas connected
- [ ] Backend environment variables set
- [ ] Frontend environment variables set
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Seed data created
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login with demo accounts
- [ ] Can create patients
- [ ] Can create and update actions
- [ ] Real-time updates working
- [ ] WebSocket connection established

---

## 🆘 Quick Debugging

### Check backend logs
```bash
# Terminal running backend
# Look for errors when API calls are made
```

### Check browser console
```bash
# F12 → Console
# Look for API errors and Socket.IO connection status
```

### Test API directly
```bash
# Using curl or Postman
curl http://localhost:5000/health
# Should return: { status: "Backend is running" }
```

### Monitor database
```bash
# Using mongosh
mongosh
use curanode
db.users.find()
db.patients.find()
db.clinicalactions.find()
```

---

## 📚 Learn More

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [README.md](README.md) - Full project documentation
- [Express.js](https://expressjs.com)
- [MongoDB](https://docs.mongodb.com)
- [React Hooks](https://react.dev/reference/react)
- [Socket.IO](https://socket.io/docs)

---

**Last Updated**: February 2026  
**Version**: 1.0.0 MVP
