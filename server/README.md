# 🌸 MamaCare Network - Server

Backend server for MamaCare Network maternal health platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to server directory:
```bash
cd server
```
2. Install dependencies:
```bash
npm install
```
3. Create environment file:

```bash
cp .env.example .env
# Edit .env with your configuration
```
4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```
5. Access the application:
```text
http://localhost:5000
```
📁 API Endpoints
Authentication (/api/auth)
```table
Method	Endpoint	Description	Access
POST	/register	Create new account	Public
POST	/login	Login to existing account	Public
POST	/logout	Logout user	Public
GET	/verify	Verify JWT token	Private
POST	/change-password	Change user password	Private
AI Services (/api/ai)
Method	Endpoint	Description	Access
POST	/analyze	Analyze symptoms	Public
GET	/week-insight/:week	Get pregnancy week insight	Public
POST	/calculate-due-date	Calculate due date from LMP	Public
POST	/analyze-vitals	Analyze vital trends	Private
POST	/chat	Chat with AI assistant	Private
GET	/pregnancy-insights/:week	Get pregnancy insights	Private
GET	/risk-stats	Get risk statistics	Nurse/Hospital
GET	/all-insights	Get all insights	Admin/Hospital
Data Management (/api/data)
Method	Endpoint	Description	Access
GET	/pregnancy/:userId	Get pregnancy records	Private
POST	/pregnancy	Save pregnancy record	Private
DELETE	/pregnancy/:recordId	Delete pregnancy record	Private
GET	/baby/:userId	Get baby records	Private
POST	/baby	Save baby record	Private
DELETE	/baby/:recordId	Delete baby record	Private
GET	/symptoms/:userId	Get symptom records	Private
POST	/symptoms	Save symptom analysis	Private
GET	/user/:userId	Get user data	Private
PUT	/user/:userId	Update user data	Private
GET	/admin/users	Get all users	Admin
```
🗄️ Data Storage
```text
The server uses JSON file storage in the /data directory:

users.json - User accounts and profiles

pregnancy-records.json - Pregnancy tracking data

baby-records.json - Baby tracking data

symptoms.json - Symptom checker analyses
```
🔒 Authentication
The API uses JWT (JSON Web Tokens) for authentication:

Login/Register to receive a token

Include token in subsequent requests:

```text
Authorization: Bearer <your-token>
🌟 Features
Role-based access control (Mother, Nurse, Hospital, Admin)

JWT authentication with token expiration

Rate limiting to prevent abuse

Security headers with Helmet

Compression for faster responses

File-based storage (easy to switch to MongoDB)

AI-powered symptom analysis

Pregnancy week insights

Due date calculator

Vital trends analysis
```
🛠️ Development
Running with nodemon (auto-reload)
```bash
npm run dev
```
Seeding test data
```bash
npm run seed
```
Environment Variables
```table
Variable	Description	    Default
PORT	        Server port	    5000
NODE_ENV	Environment	    development
JWT_SECRET	JWT signing key	        -
JWT_EXPIRE	Token expiration	7d
DATA_DIR	Data directory	      ./data
CORS_ORIGIN	CORS allowed        origin http://localhost:5000
BCRYPT_ROUNDS	Password hashing rounds	10
```
📝 API Response Format
All API responses follow this format:
Success:

```json
{
  "success": true,
  "message": "Optional success message",
  "data": { ... }
}
```
Error:
```json
{
  "success": false,
  "message": "Error description"
}
```
🚢 Deployment
Set environment variables for production

Build the client (if using build step)

Set NODE_ENV=production

Use process manager (PM2 recommended)

Example with PM2:
```bash
pm install -g pm2
pm2 start server.js --name mamacare
pm2 save
pm2 startup
```
🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/amazing)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing)

Open a Pull Request

📄 License
MIT © MamaCare Network

🌸 Support
For issues or questions:

📧 Email: mamasupport@gmail.com

📞 Phone: 651092687

💬 Live chat: Available on website