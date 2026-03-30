# 🔐 CredApp - Credential Management System

A full-stack credential management application built with Node.js/Express backend and React Vite frontend.

## Features

- 🔐 Secure user authentication with JWT
- 💾 Store and manage credentials safely
- 🔄 CRUD operations for credentials
- 🎨 Beautiful, responsive UI
- 🚀 Fast Vite frontend
- 🗄️ MongoDB database

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or use MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
cd FSD-IT-B
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file (already created with defaults)
# Edit .env and update MONGODB_URI if needed

# Start the server
npm run dev
# or
npm start
```

The server will run on `http://localhost:4001`

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Technology Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user

### Credentials (Protected Routes)
- `GET /credentials` - Get all credentials
- `GET /credentials/:id` - Get single credential
- `POST /credentials` - Create credential
- `PUT /credentials/:id` - Update credential
- `DELETE /credentials/:id` - Delete credential

## Example Usage

### Register
```bash
curl -X POST http://localhost:4001/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:4001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Add Credential
```bash
curl -X POST http://localhost:4001/credentials \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Gmail","username":"user@gmail.com","password":"pass123","url":"https://gmail.com"}'
```

## Project Structure

```
FSD-IT-B/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Credential.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── credentials.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Security Notes

⚠️ **Important Security Considerations:**
- Change the `JWT_SECRET` in `.env` to a strong random string
- Use environment variables for sensitive data
- Never commit `.env` files
- Use HTTPS in production
- Implement rate limiting on both frontend and backend
- Consider adding email verification

## Running Both Services

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `brew services start mongodb-community` (macOS)
- Check MONGODB_URI in `.env`

### CORS Error
- CORS is already configured in the server
- Check if both frontend and backend are running

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Password strength meter
- [ ] Credential search/filter
- [ ] Credential categories/tags
- [ ] Export credentials (encrypted)
- [ ] Mobile app version
- [ ] Docker containerization
- [ ] Database encryption

## License

ISC

## Author

Created for Full Stack Development Learning