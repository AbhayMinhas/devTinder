# DevTinder Backend

A robust backend API for DevTinder, a professional networking platform that connects developers based on their skills, interests, and expertise. Built with Node.js, Express.js, and MongoDB, this backend provides comprehensive features for user management, connection requests, real-time messaging, and premium membership integration.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Background Jobs](#background-jobs)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Features

### Core Functionality
- User registration and authentication with JWT-based security
- Profile management with customizable developer information
- Connection request system (send, accept, reject, ignore)
- Real-time messaging using Socket.IO
- User feed with intelligent filtering and pagination
- Premium membership with Razorpay payment integration

### Advanced Features
- Secure authentication using JWT tokens stored in HTTP-only cookies
- Email notifications via AWS SES for connection requests
- Automated daily reminders for pending connection requests using cron jobs
- Webhook integration for payment verification
- Compound indexing for optimized database queries
- CORS-enabled API for seamless frontend integration

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with bcrypt password hashing
- **Real-time Communication**: Socket.IO
- **Payment Gateway**: Razorpay
- **Email Service**: AWS SES (Simple Email Service)
- **Task Scheduling**: node-cron
- **Validation**: Validator.js
- **Additional Libraries**: cookie-parser, cors, dotenv, date-fns

## Architecture

The application follows a modular MVC-inspired architecture with clear separation of concerns:

```
src/
├── config/          # Database configuration
├── middlewares/     # Authentication and request processing
├── models/          # Mongoose schemas and models
├── routes/          # API route definitions
└── utils/           # Helper functions and utilities
```

### Key Design Patterns
- **Middleware-based authentication**: Centralized user verification
- **Schema validation**: Data integrity at the database level
- **Compound indexing**: Optimized query performance
- **Pre-save hooks**: Business logic validation before database operations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Razorpay account for payment integration
- AWS account with SES configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devtinder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

The server will start on the configured port (default: 7777).

## API Documentation

### Authentication Routes (`/`)

#### POST `/signup`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "emailId": "string",
  "password": "string"
}
```

**Response:**
- Sets JWT token in HTTP-only cookie
- Returns user object

#### POST `/login`
Authenticate existing user.

**Request Body:**
```json
{
  "emailId": "string",
  "password": "string"
}
```

**Response:**
- Sets JWT token in HTTP-only cookie
- Returns user object

#### POST `/logout`
Clear authentication session.

**Response:**
- Clears authentication cookie

### Profile Routes (`/profile`)

#### GET `/profile/view`
Retrieve authenticated user's profile.

**Authentication:** Required

**Response:**
- Returns complete user profile

#### PATCH `/profile/edit`
Update user profile information.

**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "age": "number",
  "gender": "string",
  "photoUrl": "string",
  "about": "string",
  "skills": ["string"]
}
```

### Connection Request Routes (`/request`)

#### POST `/request/send/:status/:toUserId`
Send a connection request to another user.

**Authentication:** Required

**Parameters:**
- `status`: "interested" or "ignored"
- `toUserId`: Target user's ID

**Features:**
- Prevents duplicate requests
- Validates user existence
- Sends email notification

#### POST `/request/review/:status/:requestId`
Accept or reject a received connection request.

**Authentication:** Required

**Parameters:**
- `status`: "accepted" or "rejected"
- `requestId`: Connection request ID

### User Routes (`/user`)

#### GET `/user/requests/received`
Get all pending connection requests.

**Authentication:** Required

**Response:**
- Array of connection requests with sender details

#### GET `/user/connections`
Get all accepted connections.

**Authentication:** Required

**Response:**
- Array of connected users

#### GET `/feed`
Get paginated list of potential connections.

**Authentication:** Required

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 50)

**Filtering Logic:**
- Excludes current user
- Excludes existing connections
- Excludes users with pending requests

### Payment Routes (`/payment`)

#### POST `/payment/create`
Create a Razorpay order for premium membership.

**Authentication:** Required

**Request Body:**
```json
{
  "type": "gold" | "platinum"
}
```

**Response:**
- Order details including order ID and Razorpay key

#### POST `/payment/webhook`
Razorpay webhook for payment verification.

**Authentication:** Not required (verified via signature)

**Features:**
- Validates webhook signature
- Updates payment status
- Activates premium membership

#### GET `/premium/verify`
Check user's premium membership status.

**Authentication:** Required

### Chat Routes (`/`)

Real-time messaging functionality powered by Socket.IO.

## Database Schema

### User Model
```javascript
{
  firstName: String (required, 4-50 chars),
  lastName: String,
  emailId: String (required, unique, validated),
  password: String (required, strong password),
  age: Number (min: 18),
  gender: String (enum: male/female/others),
  isPremium: Boolean (default: false),
  membershipType: String,
  photoUrl: String (validated URL),
  about: String,
  skills: [String],
  timestamps: true
}
```

**Indexes:**
- Compound index on firstName and lastName
- Single indexes on frequently queried fields

### Connection Request Model
```javascript
{
  fromUserId: ObjectId (ref: User),
  toUserId: ObjectId (ref: User),
  status: String (enum: ignored/interested/accepted/rejected),
  timestamps: true
}
```

**Indexes:**
- Compound index on fromUserId and toUserId for optimized queries

**Validation:**
- Pre-save hook prevents self-connection requests

### Payment Model
```javascript
{
  userId: ObjectId (ref: User),
  orderId: String,
  status: String,
  amount: Number,
  currency: String,
  receipt: String,
  notes: Object
}
```

## Authentication

The application uses JWT-based authentication with the following security measures:

1. **Password Security**: Passwords are hashed using bcrypt with 10 salt rounds
2. **Token Storage**: JWT tokens are stored in HTTP-only cookies with 8-hour expiration
3. **Token Validation**: Middleware verifies tokens on protected routes
4. **User Methods**: 
   - `getJWT()`: Generates JWT token for user
   - `validatePassword()`: Compares provided password with stored hash

### Protected Routes
All routes except `/signup`, `/login`, and `/payment/webhook` require authentication via the `userAuth` middleware.

## Payment Integration

### Razorpay Integration
- Creates orders with proper amount conversion (paisa/cents)
- Stores order details in database before payment
- Webhook verification using signature validation
- Automatic premium status activation on successful payment

### Membership Types
Configured in `src/utils/constants.js` with different pricing tiers.

### Security
- Webhook signature verification prevents fraudulent requests
- Server-side payment validation ensures integrity
- Payment status tracked throughout the lifecycle

## Background Jobs

### Daily Email Reminders
A cron job runs daily at 8:00 AM to:
1. Find all pending connection requests from the previous day
2. Collect unique recipient email addresses
3. Send reminder emails via AWS SES

**Implementation:**
```javascript
cron.schedule("0 8 * * *", async () => {
  // Find yesterday's pending requests
  // Send email reminders to recipients
});
```

### Email Service
AWS SES integration for transactional emails:
- Connection request notifications
- Daily reminder emails
- Configurable email templates

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=7777

# Database
DB_CONNECTION_SECRET=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AWS SES
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Security Note:** Never commit the `.env` file to version control. Use `.env.example` for documentation.

## Project Structure

```
devtinder/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection setup
│   ├── middlewares/
│   │   └── auth.js                # JWT authentication middleware
│   ├── models/
│   │   ├── user.js                # User schema and methods
│   │   ├── connectionRequest.js   # Connection request schema
│   │   ├── chat.js                # Chat message schema
│   │   └── payments.js            # Payment transaction schema
│   ├── routes/
│   │   ├── auth.js                # Authentication endpoints
│   │   ├── profile.js             # Profile management
│   │   ├── request.js             # Connection requests
│   │   ├── user.js                # User discovery and connections
│   │   ├── payment.js             # Payment processing
│   │   └── chat.js                # Messaging endpoints
│   ├── utils/
│   │   ├── constants.js           # Application constants
│   │   ├── cronjob.js             # Scheduled tasks
│   │   ├── razorpay.js            # Razorpay instance
│   │   ├── sendEmail.js           # AWS SES email utility
│   │   ├── sesClient.js           # AWS SES client configuration
│   │   ├── socket.js              # Socket.IO setup
│   │   └── validation.js          # Input validation helpers
│   └── app.js                     # Application entry point
├── .env                           # Environment variables (not in repo)
├── .gitignore
├── package.json
└── README.md
```

## Development

### Code Organization
- **Routes**: Define API endpoints and delegate to appropriate handlers
- **Models**: Define data schemas with validation and business logic
- **Middlewares**: Handle cross-cutting concerns like authentication
- **Utils**: Reusable helper functions and service integrations

### Best Practices Implemented
- Input validation at multiple levels (schema, route, middleware)
- Secure password handling with bcrypt
- Proper error handling with try-catch blocks
- Database query optimization with indexes
- Pagination for large datasets
- CORS configuration for frontend integration
- Environment-based configuration

## Contributing

When contributing to this project:
1. Follow the existing code structure and naming conventions
2. Add appropriate validation for new endpoints
3. Update this README with any new features or changes
4. Test authentication flows thoroughly
5. Ensure database queries are optimized with proper indexes

## License

ISC

## Author

Abhay Minhas

---

**Note**: This is the backend API for DevTinder. The frontend is built separately using React, Redux Toolkit, and DaisyUI.
