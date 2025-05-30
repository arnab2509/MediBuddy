# MediBuddy - Healthcare Appointment System

A full-stack application for booking doctor appointments, managing patient records, and handling medical services.

## Security Notice

This project uses environment variables for sensitive configuration. **Never commit .env files to version control.**

## Setup Instructions

### Environment Variables

1. Copy the example environment file:
   ```
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp admin/.env.example admin/.env
   ```

2. Update the `.env` files with your actual credentials. Required variables:

   **Backend:**
   - MongoDB connection string
   - JWT secret
   - Cloudinary credentials
   - Payment gateway credentials (Razorpay/Stripe)

   **Frontend/Admin:**
   - Backend API URL
   - Payment gateway public keys

### Database Setup

1. Make sure MongoDB is running
2. Run the database seed script to populate initial data:
   ```
   cd backend
   node seedDoctors.js
   ```

### Running the Application

**Backend:**
```
cd backend
npm install
npm start
```

**Frontend:**
```
cd frontend
npm install
npm run dev
```

**Admin Panel:**
```
cd admin
npm install
npm run dev
```

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files to git
   - Use `.env.example` files as templates without sensitive data
   - Regularly rotate credentials

2. **API Security**:
   - All API endpoints requiring authentication are protected
   - Secure password storage with bcrypt hashing
   - JWT token-based authentication with expiration

3. **Frontend Security**:
   - No sensitive data stored in local storage other than JWT tokens
   - Input validation on both client and server sides

## License

MIT
# MediBuddy
