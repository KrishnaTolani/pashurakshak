# PashuRakshak API Documentation

This document outlines all the completed API endpoints in the PashuRakshak application and how to test them.

## Base URL
```
http://localhost:5000
```

## Authentication APIs

### Register an NGO
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new NGO account (requires admin approval)
- **Request Body**:
  ```json
  {
    "name": "Animal Welfare NGO",
    "email": "ngo@example.com",
    "password": "password123",
    "contactPerson": {
      "name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com"
    },
    "organizationType": "Animal Welfare",
    "registrationNumber": "AWN12345",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "focusAreas": ["Animal Rescue", "Pet Adoption"],
    "website": "https://example.com"
  }
  ```
- **Success Response**: Status 201
  ```json
  {
    "success": true,
    "message": "NGO registration submitted successfully",
    "data": {
      "id": "12345",
      "name": "Animal Welfare NGO",
      "email": "ngo@example.com",
      "status": "pending"
    }
  }
  ```
- **Testing**: Use Postman or curl to send a POST request with the JSON body above

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login as an approved NGO
- **Request Body**:
  ```json
  {
    "email": "ngo@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "jwt_token_here",
      "ngo": {
        "id": "12345",
        "name": "Animal Welfare NGO",
        "email": "ngo@example.com",
        "status": "approved"
      }
    }
  }
  ```
- **Testing**: Use Postman or curl to send a POST request with the credentials

### Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Description**: Request password reset for an NGO account
- **Request Body**:
  ```json
  {
    "email": "ngo@example.com"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```
- **Testing**: Use Postman or curl to send a POST request with the email

### Reset Password
- **Endpoint**: `POST /api/auth/reset-password/:token`
- **Description**: Reset password using token received via email
- **Request Body**:
  ```json
  {
    "password": "newpassword123"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "message": "Password has been reset"
  }
  ```
- **Testing**: First use the forgot password endpoint, check the email for the token, then use this endpoint with the token

## Admin APIs

### Admin Login
- **Endpoint**: `POST /api/admin/login`
- **Description**: Login as an administrator
- **Request Body**:
  ```json
  {
    "email": "admin@pashurakshak.org",
    "password": "admin123"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "jwt_token_here",
      "user": {
        "email": "admin@pashurakshak.org",
        "role": "admin"
      }
    }
  }
  ```
- **Testing**: Use Postman or curl to send a POST request with the admin credentials

### Verify Admin Token
- **Endpoint**: `GET /api/admin/verify`
- **Description**: Verify if the admin token is valid
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "admin",
        "role": "admin",
        "email": "admin@pashurakshak.org"
      }
    }
  }
  ```
- **Testing**: Use Postman or curl to send a GET request with the Authorization header containing the admin token

### Get All NGO Registrations
- **Endpoint**: `GET /api/admin/registrations`
- **Description**: Get a list of all NGO registrations
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "registrations": [
      {
        "_id": "12345",
        "name": "Animal Welfare NGO",
        "email": "ngo@example.com",
        "status": "pending",
        "organizationType": "Animal Welfare",
        "address": {
          "state": "Maharashtra"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```
- **Testing**: Login as admin to get the token, then use Postman or curl to send a GET request with the Authorization header

### Update NGO Registration Status
- **Endpoint**: `PUT /api/admin/registrations/:id`
- **Description**: Approve or reject an NGO registration
- **Headers**: 
  ```
  Authorization: Bearer <admin_token>
  ```
- **Request Body**:
  ```json
  {
    "status": "approved"  // or "rejected"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "message": "NGO status updated to approved",
    "data": {
      "id": "12345",
      "name": "Animal Welfare NGO",
      "email": "ngo@example.com",
      "status": "approved"
    }
  }
  ```
- **Testing**: First get the NGO ID from the registrations list, then use Postman or curl to send a PUT request with the status

## NGO APIs

### Get NGO Profile
- **Endpoint**: `GET /api/ngo/profile`
- **Description**: Get the profile of the logged-in NGO
- **Headers**: 
  ```
  Authorization: Bearer <ngo_token>
  ```
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "data": {
      "_id": "12345",
      "name": "Animal Welfare NGO",
      "email": "ngo@example.com",
      "status": "approved",
      // other NGO details
    }
  }
  ```
- **Testing**: Login as an NGO to get the token, then use Postman or curl to send a GET request with the Authorization header

### Get NGO Status
- **Endpoint**: `GET /api/ngo/status/:id`
- **Description**: Check the status of an NGO registration using its ID
- **Success Response**: Status 200
  ```json
  {
    "success": true,
    "data": {
      "name": "Animal Welfare NGO",
      "status": "pending",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```
- **Testing**: After registering an NGO, use the returned ID to check its status with this endpoint

## Testing the APIs

### Tools Required
1. **Postman** or similar API testing tool
2. **cURL** for command-line testing
3. Running local MongoDB instance

### Setup for Testing
1. Start MongoDB server
2. Start the backend server:
   ```
   cd backend
   npm start
   ```
   or for development:
   ```
   cd backend
   npm run dev
   ```
3. The server will run on port 5000 by default

### Testing Flow Example
1. Register an NGO using `/api/auth/register`
2. Login as admin using `/api/admin/login`
3. View pending registrations using `/api/admin/registrations`
4. Approve the NGO using `/api/admin/registrations/:id`
5. Login as the NGO using `/api/auth/login`
6. Access the NGO profile using `/api/ngo/profile`

### cURL Examples

#### Register an NGO
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test NGO",
    "email": "test@example.com",
    "password": "password123",
    "contactPerson": {
      "name": "Test Person",
      "phone": "9876543210",
      "email": "person@example.com"
    },
    "organizationType": "Animal Welfare",
    "registrationNumber": "TEST12345",
    "address": {
      "street": "Test Street",
      "city": "Test City",
      "state": "Test State",
      "pincode": "123456"
    },
    "focusAreas": ["Animal Rescue"],
    "website": "https://test.com"
  }'
```

#### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pashurakshak.org",
    "password": "admin123"
  }'
```

#### View Registrations (with admin token)
```bash
curl -X GET http://localhost:5000/api/admin/registrations \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

### Error Handling
All API endpoints return appropriate error responses with HTTP status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid credentials)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error

### Notes
- Remember to save the tokens returned from login endpoints
- The admin credentials are hardcoded for development (admin@pashurakshak.org/admin123)
- NGO accounts need admin approval before they can login 