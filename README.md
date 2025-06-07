# React-Express-MongoDB Login & Signup Application

## Overview

This project is a **full-stack login and signup application** built with:

- **React** for the frontend
- **Express** for the backend
- **MongoDB** for the database
- **Bootstrap** for styling and layout.
- **Axios** for HTTP client for API requests.
- **bcryptjs** for password hashing.
- **jsonwebtoken** for token-based authentication.

The application allows users to:

1. Sign up with their details (name, email, password, etc.).
2. Sign in using their credentials.
3. Retrieve a list of all users (admin functionality).

---

## Features

- **Frontend**:
  - Built with React and styled using Bootstrap.
  - Form validation and persistent user state.
  - Axios for secure HTTP request
- **Backend**:
  - Built with Express and MongoDB (Mongoose for schema management).
  - Password hashing with `bcryptjs`.
  - Authentication and authorization with `jsonwebtoken`.
- **Database**:
  - MongoDB for storing user data securely.
  - **Fast Development Workflow**:
    Uses Vite for speedy builds and hot module replacement.

---

## Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/greigmc/login-signup.git
```

### **2. Install Dependencies**:

    ```bash
    npm install
    ```

### **3. Running the Application**:

Start both the React development server and Express server:

```bash
npm run dev
```

---

## Recommendations / Future Improvements 🚀

- **Protect Private Routes**:  
  Implement authentication middleware to secure backend routes and prevent unauthorized access.

- **Refresh Tokens**:  
  Add refresh token support to allow users to stay logged in without needing to frequently re-authenticate.

- **Forgot Password Functionality**:  
  Allow users to reset their password securely by sending a password reset link to their email.

- **User Roles and Permissions**:  
  Introduce user roles (e.g., Admin, User) to control access to specific parts of the application.

- **Email Verification**:  
  Send verification emails upon signup to confirm the user's email address before allowing full access.

- **Profile Management**:  
  Enable users to update their profile information (name, email, password, etc.) via a settings page.

- **UI/UX Enhancements**:  
  Improve user feedback with toast notifications (e.g., success/error messages) and loading spinners during API calls.

- **Production Deployment**:  
  Prepare the application for deployment by:

  - Creating optimized frontend builds
  - Hosting the backend on services like Render, Railway, or Heroku
  - Hosting the frontend on Vercel, Netlify, or similar platforms
  - Using environment variables for secure configurations

- **Testing**:  
  Add unit tests and integration tests for both frontend (React Testing Library) and backend (Jest, Supertest).

---
