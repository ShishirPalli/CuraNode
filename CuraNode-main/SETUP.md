# 🚀 CURANODE Setup Guide

Complete step-by-step instructions to get CURANODE running on your machine.

---

## ✅ Prerequisites

Before you start, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v4.0+)
  - **Option 1**: [Local Installation Guide](https://docs.mongodb.com/manual/installation/)
  - **Option 2**: [MongoDB Atlas Cloud](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Git** (optional, for version control)

### Verify Prerequisites
```bash
node --version  # Should be v14+
npm --version   # Should be v6+
mongod --version # Should display version
```

---

## 📦 Step 1: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install

# Output should show:
# added XXX packages in Xm Xs
```

### Frontend Dependencies
```bash
cd ../frontend
npm install

# Output should show:
# added XXX packages in Xm Xs
```

---

## 🗄️ Step 2: Setup MongoDB

### Option A: Local MongoDB

#### Windows
1. Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. In PowerShell (Administrator):
```powershell
net start MongoDB
# If successful: The MongoDB service has been started.
```

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/curanode`
5. Update `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/curanode
```

### Verify MongoDB is Running
```bash
# Test connection (you'll see MongoDB connection successful message)
# Or open MongoDB Compass and connect to localhost:27017
```

---

## ⚙️ Step 3: Configure Environment Variables

Environment files are already created. Verify they exist:

### Backend (`backend/.env`)
```bash
MONGODB_URI=mongodb://localhost:27017/curanode
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

**For MongoDB Atlas**, update `backend/.env`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/curanode
```

---

## 🌱 Step 4: Seed Demo Data (Recommended)

Populate the database with demo users and patients:

```bash
# From project root CuraNode/
node seed.js

# ✅ Output:
# 🔄 Clearing existing data...
# 👥 Creating demo users...
# 👨‍🏥 Creating demo patients...
# 📋 Creating demo clinical actions...
# ✅ Database seeded successfully!
#
# 📝 Demo Credentials:
# 👨‍⚕️  Doctor: doctor@hospital.com / password123
# 👩‍⚕️  Nurse: nurse@hospital.com / password123
# 💊 Pharmacy: pharmacy@hospital.com / password123
# 🔬 Lab Staff: lab@hospital.com / password123
```

---

## 🏃 Step 5: Start the Application

You'll need **3 terminal windows**:

### Terminal 1: MongoDB
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Output: 
# [initandlisten] Waiting for connections on port 27017
```

### Terminal 2: Backend Server
```bash
cd backend
npm run dev

# ✅ Expected Output:
# ✅ MongoDB connected
# 🚀 Server running on port 5000
# 📡 WebSocket server ready for connections
```

### Terminal 3: Frontend Server
```bash
cd frontend
npm start

# ✅ Expected Output:
# Compiled successfully!
# 
# Local:   http://localhost:3000
# Browser should open automatically
```

---

## 🎯 Step 6: Test the Application

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Backend Health**: http://localhost:5000/health

### Login with Demo Account
1. Open http://localhost:3000
2. Click "Login"
3. Use credentials:
   - Email: `doctor@hospital.com`
   - Password: `password123`
4. Click "Login"

### Expected Behavior After Login
- ✅ Redirected to Dashboard
- ✅ See "Doctor Dashboard" with patient list
- ✅ See "Create Patient" button

---

## 🧪 Test Core Workflow

### Test 1: Doctor Creates Patient
1. Click "+ Create Patient"
2. Fill in patient details
3. Click "Create Patient"
4. Return to dashboard and see patient in list

### Test 2: Doctor Creates Clinical Action
1. Click on a patient from dashboard
2. Click "+ New Clinical Action"
3. Fill details:
   - Title: "Blood Test"
   - Description: "Complete blood count"
   - Action Type: "Diagnostic Request"
   - Department: "Lab"
4. Click "Create Action"
5. Action appears in timeline

### Test 3: Real-Time Update (Multi-User Test)
1. **Browser 1**: Stay logged in as Doctor
   - Go to patient detail page
   - Can see clinical action

2. **Browser 2**: Open new tab → http://localhost:3000
   - Login as Lab Staff (lab@hospital.com / password123)
   - Go to Dashboard
   - See pending diagnostic request
   - Change status to "In Progress"

3. **Browser 1**: 
   - Watch the patient detail page
   - Action status updates in REAL-TIME without refresh!

---

## 🔧 Useful Commands

### Backend
```bash
cd backend

# Development mode (auto-reload on file changes)
npm run dev

# Production mode
npm start

# Install a new package
npm install package-name
```

### Frontend
```bash
cd frontend

# Development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database
```bash
# Connect to MongoDB
mongosh

# In mongosh, useful commands:
use curanode              # Switch to curanode database
db.users.find()          # View all users
db.patients.find()       # View all patients
db.clinicalactions.find() # View all actions
db.dropDatabase()        # Delete all data
```

---

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Or check if Atlas connection string is correct
# Test connection: mongosh "mongodb+srv://..."
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in backend/.env
PORT=5001
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Or set a different port
PORT=3001 npm start
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "WebSocket connection failed"
**Solution:**
```bash
# Ensure backend is running
# Check browser console for error details
# Verify CORS settings in backend/server.js

# The app should still work without WebSocket,
# but real-time updates won't work
```

### Issue: "CORS error" in browser console
**Solution:**
```bash
# This is expected in development
# Backend server.js has CORS enabled for http://localhost:3000
# If accessing from different port, update CORS in backend/server.js:

io.cors.origin = "http://localhost:YOUR_PORT"
```

---

## 📱 Accessing from Mobile/Different Machine

### Option 1: Get Your Machine IP
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig | findstr "IPv4"
```

### Option 2: Update Frontend Environment
Edit `frontend/.env`:
```bash
REACT_APP_API_URL=http://YOUR_MACHINE_IP:5000/api
```

### Option 3: Access
- From mobile/another machine: `http://YOUR_MACHINE_IP:3000`

---

## 📚 Project File Organization

After setup, you should have:
```
CuraNode/
├── backend/
│   ├── node_modules/       (created after npm install)
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json   (created after npm install)
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── node_modules/       (created after npm install)
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json   (created after npm install)
│   ├── .env
│   └── .env.example
├── seed.js
├── .gitignore
├── README.md
└── SETUP.md (this file)
```

---

## ✨ You're All Set!

Your CURANODE application should now be running!

### Next Steps:
1. ✅ Test with different user roles
2. ✅ Create multiple patients
3. ✅ Test real-time updates with multiple browsers
4. ✅ Explore all features
5. ✅ Read the [README.md](README.md) for API details

### Get Help:
- Check browser console for errors (F12)
- Check backend terminal for error logs
- Review [Troubleshooting](#-common-issues--solutions) section above

---

**Happy Testing!** 🎉
