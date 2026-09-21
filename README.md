# JobTrack

A full-stack Job Application Tracking System built with the MERN stack.

JobTrack is designed as a realistic software-engineering project rather
than a collection of small practice applications. The goal is to
understand how a production-style application is structured, how
frontend and backend communicate, how authentication works, how data is
modeled, and how common backend concerns such as validation, error
handling, authorization, testing, and deployment fit together.

## Project Goals

JobTrack allows users to:

-   Create an account
-   Log in securely
-   Track job applications
-   Store application details such as company, role, status, location,
    salary, and source
-   Update application status as the hiring process progresses
-   Eventually view useful application analytics
-   Access only their own application data

The project is being developed incrementally so that each feature is
understood before moving to the next one.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   Fetch API
-   HTML/CSS

### Backend

-   Node.js
-   Express.js
-   REST API
-   JWT authentication
-   bcrypt password hashing
-   CORS
-   dotenv

### Database

-   MongoDB Atlas
-   Mongoose

### Development Tools

-   VS Code
-   Git
-   GitHub
-   Postman
-   Nodemon

------------------------------------------------------------------------

## High-Level Architecture

``` text
                    ┌─────────────────────┐
                    │      React App      │
                    │    localhost:5173   │
                    └──────────┬──────────┘
                               │
                         HTTP / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express API      │
                    │    localhost:5000   │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
              Controllers             Middleware
                    │                     │
                    ▼                     │
                 Models ◄────────────────┘
                    │
                    ▼
              MongoDB Atlas
```

------------------------------------------------------------------------

## Project Structure

``` text
JobTrack/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Application.js
│   │
│   ├── routes/
│   │   └── authRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> The structure will grow as more features are implemented.

------------------------------------------------------------------------

# Backend Setup

## 1. Create the server

The backend is an Express application running on port `5000`.

``` bash
cd server
npm init -y
```

## 2. Install dependencies

``` bash
npm install express cors mongoose dotenv bcrypt jsonwebtoken
```

For development:

``` bash
npm install --save-dev nodemon
```

------------------------------------------------------------------------

# Environment Variables

Create a file:

``` text
server/.env
```

Example:

``` env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Do not commit `.env` to GitHub.

The project `.gitignore` contains:

``` gitignore
node_modules/
.env
.env.*
dist/
build/
```

------------------------------------------------------------------------

# Database Connection

The database connection is handled in:

``` text
server/config/db.js
```

Mongoose connects to MongoDB Atlas using `MONGODB_URI`.

The connection is initialized when the Express server starts.

------------------------------------------------------------------------

# Express Server

The main backend entry point is:

``` text
server/server.js
```

Responsibilities include:

-   Loading environment variables
-   Creating the Express application
-   Enabling CORS
-   Parsing JSON request bodies
-   Connecting to MongoDB
-   Registering API routes
-   Starting the HTTP server

Current API health endpoint:

``` http
GET /api/health
```

Example response:

``` json
{
  "success": true,
  "message": "JobTrack API is running"
}
```

------------------------------------------------------------------------

# API Design

The backend follows a REST-style structure.

Current authentication routes:

``` text
POST /api/auth/register
POST /api/auth/login
```

Planned application routes:

``` text
GET    /api/applications
GET    /api/applications/:id
POST   /api/applications
PUT    /api/applications/:id
DELETE /api/applications/:id
```

------------------------------------------------------------------------

# Authentication

JobTrack uses:

-   bcrypt for password hashing
-   JWT for authentication

## Registration Flow

``` text
Client
  │
  │ name + email + password
  ▼
POST /api/auth/register
  │
  ▼
Validate input
  │
  ▼
Check whether email already exists
  │
  ▼
Hash password using bcrypt
  │
  ▼
Create User document
  │
  ▼
Return user information
```

Passwords are never stored as plain text.

Example:

``` text
User password:
123456

Stored value:
bcrypt hash
```

The registration response does not return the user's password.

------------------------------------------------------------------------

# Login Flow

``` text
Client
  │
  │ email + password
  ▼
POST /api/auth/login
  │
  ▼
Find user by email
  │
  ▼
bcrypt.compare()
  │
  ├── Incorrect → 401
  │
  └── Correct
        │
        ▼
    Generate JWT
        │
        ▼
    Return token
```

The JWT contains the user's ID.

Conceptually:

``` js
{
  userId: user._id
}
```

The JWT is signed using the server-side `JWT_SECRET`.

------------------------------------------------------------------------

# JWT Secret vs JWT Token

### JWT Secret

The JWT secret is a private value known only by the server.

It is used to sign and verify JWT tokens.

``` text
JWT_SECRET
    ↓
Server signs token
```

### JWT Token

The JWT token is created after successful login and returned to the
client.

The client sends the token with protected API requests.

``` text
JWT Token
    ↓
Authorization: Bearer <token>
    ↓
Backend
    ↓
Verify using JWT_SECRET
```

The JWT secret must never be sent to the frontend or committed to
GitHub.

------------------------------------------------------------------------

# Authentication Middleware

Authentication middleware is responsible for protecting routes.

The middleware will:

1.  Read the `Authorization` header
2.  Extract the Bearer token
3.  Verify the token using `JWT_SECRET`
4.  Extract the user's ID
5.  Attach the user ID to the request
6.  Call `next()` if authentication succeeds
7.  Return `401 Unauthorized` if the token is invalid or missing

Expected request format:

``` http
Authorization: Bearer <JWT_TOKEN>
```

The middleware will eventually make the authenticated user's ID
available as:

``` js
req.user
```

This will allow application controllers to associate every job
application with its owner.

------------------------------------------------------------------------

# User Model

The User model is located at:

``` text
server/models/User.js
```

Current fields:

  Field       Type        Required Purpose
  ----------- -------- ----------- ----------------------
  name        String           Yes User's name
  email       String           Yes Login identifier
  password    String           Yes bcrypt password hash
  createdAt   Date       Automatic Creation timestamp
  updatedAt   Date       Automatic Update timestamp

Email is configured as unique, lowercase, and trimmed.

------------------------------------------------------------------------

# Application Model

The Application model is located at:

``` text
server/models/Application.js
```

Current planned fields:

  Field            Type         Required Purpose
  ---------------- ---------- ---------- ----------------------------
  userId           ObjectId          Yes Owner of application
  companyName      String            Yes Company name
  role             String            Yes Job role
  appliedThrough   String            Yes Application source
  referrerName     String             No Referral person's name
  portal           String             No Job portal name
  dateApplied      Date              Yes Application date
  status           String            Yes Current application status
  location         String            Yes Job location
  salary           Number             No Expected/offered salary
  jobPostingLink   String             No Job posting URL
  notes            String             No Additional notes

Allowed `appliedThrough` values:

``` text
Referral
Job Portal
Company Website
LinkedIn
Other
```

Allowed `status` values:

``` text
Applied
Interview
Selected
Rejected
Withdrawn
```

------------------------------------------------------------------------

# Data Ownership

A major requirement of JobTrack is that users must only access their own
applications.

The relationship is:

``` text
User
 │
 └── userId
       │
       ▼
Application
```

For example:

``` text
User A
 ├── Application 1
 ├── Application 2
 └── Application 3

User B
 ├── Application 4
 └── Application 5
```

User A must not be able to access User B's applications.

This will be enforced on the backend rather than relying only on
frontend filtering.

------------------------------------------------------------------------

# Error Handling

The API uses appropriate HTTP status codes.

Common examples:

``` text
400 Bad Request
```

Used when required input is missing or invalid.

``` text
401 Unauthorized
```

Used when authentication fails or a token is invalid.

``` text
409 Conflict
```

Used when a resource conflicts with existing data, such as registering
an already-used email.

``` text
500 Internal Server Error
```

Used for unexpected server-side errors.

Example error response:

``` json
{
  "success": false,
  "message": "Invalid email or password"
}
```

------------------------------------------------------------------------

# Validation

Current registration validation includes:

-   Name is required
-   Email is required
-   Email format is checked
-   Password is required
-   Password must contain at least 6 characters
-   Duplicate email addresses are rejected

Additional validation will be added as application features are
implemented.

------------------------------------------------------------------------

# Testing

Postman is currently used to test the backend independently of the React
frontend.

## Health Check

``` http
GET http://localhost:5000/api/health
```

## Register

``` http
POST http://localhost:5000/api/auth/register
```

Body:

``` json
{
  "name": "Sejal",
  "email": "test@example.com",
  "password": "123456"
}
```

## Login

``` http
POST http://localhost:5000/api/auth/login
```

Body:

``` json
{
  "email": "test@example.com",
  "password": "123456"
}
```

------------------------------------------------------------------------

# Frontend

The frontend is located in:

``` text
client/
```

It is created using Vite and React.

Development server:

``` text
http://localhost:5173
```

The frontend communicates with the backend through HTTP requests.

Example:

``` js
fetch("http://localhost:5000/api/health")
```

CORS is enabled in Express so the React development server can
communicate with the backend.

------------------------------------------------------------------------

# Running the Project Locally

## Start Backend

``` bash
cd server
npm run dev
```

Backend:

``` text
http://localhost:5000
```

## Start Frontend

Open another terminal:

``` bash
cd client
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# Git Workflow

The project is developed using Git checkpoints.

Recommended workflow:

``` bash
git status
git add .
git commit -m "Describe the completed feature"
git push
```

Commits should represent meaningful completed features rather than every
small edit.

Example checkpoints:

``` text
Set up MERN project and database connection
Implement user registration and error handling
Implement JWT login authentication
Add authentication middleware
Implement job application CRUD
Add application validation
Add dashboard analytics
```

------------------------------------------------------------------------

# Current Development Progress

## Completed

-   [x] React + Vite frontend setup
-   [x] Node + Express backend setup
-   [x] MongoDB Atlas connection
-   [x] Environment variables
-   [x] CORS configuration
-   [x] JSON request parsing
-   [x] API health endpoint
-   [x] Git/GitHub setup
-   [x] User model
-   [x] Application model
-   [x] Registration route
-   [x] Registration controller
-   [x] Input validation
-   [x] Duplicate email checking
-   [x] bcrypt password hashing
-   [x] Registration error handling
-   [x] JWT package installation
-   [x] Login route
-   [x] Login validation
-   [x] User lookup during login
-   [x] bcrypt password comparison
-   [x] JWT generation
-   [x] JWT environment secret
-   [x] Authentication middleware

## In Progress / Next

-   [ ] Test protected route with JWT
-   [ ] Complete authentication flow
-   [ ] Build job application CRUD APIs
-   [ ] Connect applications to authenticated users
-   [ ] Protect application routes
-   [ ] Build React authentication UI
-   [ ] Store authentication state on frontend
-   [ ] Build application form
-   [ ] Build application list
-   [ ] Add edit/delete functionality
-   [ ] Add filters and search
-   [ ] Add dashboard analytics
-   [ ] Add frontend validation
-   [ ] Improve error handling
-   [ ] Add backend tests
-   [ ] Add frontend tests
-   [ ] Security improvements
-   [ ] Deployment
-   [ ] CI/CD basics
-   [ ] Production documentation

------------------------------------------------------------------------

# Learning Approach

This project is intentionally being developed using the following cycle:

``` text
Requirement
    ↓
Understand the problem
    ↓
Think about the logic
    ↓
Design the data flow
    ↓
Write pseudocode
    ↓
Write code
    ↓
Test
    ↓
Debug
    ↓
Commit
```

The purpose is not only to make JobTrack work, but to understand why
each part exists.

------------------------------------------------------------------------

# Future Features

Planned improvements include:

### Authentication

-   Login/logout
-   JWT middleware
-   Protected routes
-   Token handling
-   Better authentication error handling

### Job Applications

-   Create application
-   View all applications
-   View one application
-   Update application
-   Delete application
-   Search applications
-   Filter by status
-   Filter by source
-   Sort by application date

### Dashboard

Potential metrics:

-   Total applications
-   Interviews
-   Selected applications
-   Rejected applications
-   Applications by status
-   Applications by source
-   Monthly application trends

### Engineering Improvements

-   Centralized error handling
-   Request validation middleware
-   Security headers
-   Rate limiting
-   Better API structure
-   Automated tests
-   API documentation
-   Deployment
-   CI/CD

------------------------------------------------------------------------

# Security Notes

Never commit sensitive values such as:

-   MongoDB credentials
-   JWT secret
-   API keys
-   Passwords
-   Private tokens

Keep secrets in environment variables.

The `.env` file should remain local and should never be pushed to
GitHub.

------------------------------------------------------------------------

# License

This project is currently intended as a learning and portfolio project.
