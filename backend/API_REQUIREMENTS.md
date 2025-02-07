# API Requirements for NGO Authentication

## Overview
This document outlines the additional API endpoints and modifications needed for NGO (Non-Governmental Organization) authentication in the Pashu Rakshak system.

## New Endpoints Required

### 1. NGO Registration
```typescript
POST /api/auth/ngo/register

Request Body:
{
  "ngoName": string,          // Name of the NGO
  "registrationNumber": string, // Official NGO registration number
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string
  },
  "adminDetails": {
    "name": string,
    "email": string,
    "password": string,    // Min 8 chars, 1 uppercase, 1 number
    "phone": string
  },
  "documents": {
    "registrationCertificate": File,  // Required
    "taxExemptionCertificate": File   // Optional
  }
}

Response (201 Created):
{
  "success": true,
  "message": "NGO registration submitted successfully",
  "data": {
    "ngoId": string,
    "status": "pending",
    "adminId": string
  }
}

Possible Errors:
- 400: Invalid input data
- 409: NGO already registered
- 413: File size too large
- 415: Unsupported file type
```

### 2. NGO Admin Login
```typescript
POST /api/auth/ngo/login

Request Body:
{
  "email": string,
  "password": string
}

Response (200 OK):
{
  "success": true,
  "data": {
    "token": string,           // JWT token
    "refreshToken": string,    // For token refresh
    "ngo": {
      "id": string,
      "name": string,
      "status": string,       // pending/verified/rejected
      "address": {
        "city": string,
        "state": string
      }
    },
    "admin": {
      "id": string,
      "name": string,
      "email": string,
      "role": string         // admin/staff
    }
  }
}

Possible Errors:
- 401: Invalid credentials
- 403: Account not verified
- 404: NGO not found
```

### 3. NGO Profile Management
```typescript
GET /api/ngo/profile
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "ngo": {
      "id": string,
      "name": string,
      "registrationNumber": string,
      "status": string,
      "address": {...},
      "documents": {
        "registrationCertificate": string,  // URL
        "taxExemptionCertificate": string   // URL
      },
      "verificationStatus": {
        "status": string,
        "message": string,
        "updatedAt": string
      }
    }
  }
}

PUT /api/ngo/profile
Authorization: Bearer {token}

Request Body:
{
  "ngoName": string,
  "address": {
    "street": string,
    "city": string,
    "state": string,
    "pincode": string,
    "country": string
  },
  "operationalAreas": string[],  // Areas where NGO operates
  "services": string[],          // Types of services provided
  "contactDetails": {
    "email": string,
    "phone": string,
    "website": string           // Optional
  }
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "ngo": {...}  // Updated NGO data
  }
}
```

### 4. NGO Staff Management
```typescript
POST /api/ngo/staff
Authorization: Bearer {token}

Request Body:
{
  "name": string,
  "email": string,
  "phone": string,
  "role": "staff",
  "permissions": string[]  // Array of permission codes
}

GET /api/ngo/staff
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "staff": [{
      "id": string,
      "name": string,
      "email": string,
      "role": string,
      "status": string,
      "permissions": string[],
      "createdAt": string
    }]
  }
}
```

## Database Schema Changes

### NGO Collection
```typescript
{
  _id: ObjectId,
  name: string,
  registrationNumber: string,
  address: {
    street: string,
    city: string,
    state: string,
    pincode: string,
    country: string
  },
  status: enum['pending', 'verified', 'rejected'],
  documents: {
    registrationCertificate: {
      url: string,
      uploadedAt: Date
    },
    taxExemptionCertificate?: {
      url: string,
      uploadedAt: Date
    }
  },
  operationalAreas: string[],
  services: string[],
  contactDetails: {
    email: string,
    phone: string,
    website?: string
  },
  verificationDetails: {
    status: string,
    message?: string,
    verifiedBy?: ObjectId,
    verifiedAt?: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### NGO Admin/Staff Collection
```typescript
{
  _id: ObjectId,
  ngoId: ObjectId,
  name: string,
  email: string,
  password: string,  // Hashed
  phone: string,
  role: enum['admin', 'staff'],
  permissions: string[],
  status: enum['active', 'inactive', 'blocked'],
  emailVerified: boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Requirements

1. Password Requirements:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 number
   - At least 1 special character

2. Token Management:
   - JWT tokens with 1 hour expiry
   - Refresh tokens with 7 days expiry
   - Token rotation on refresh

3. Rate Limiting:
   - Login attempts: 5 per 15 minutes
   - Registration attempts: 3 per hour per IP
   - Password reset: 3 per 24 hours

4. Document Upload:
   - Max file size: 5MB
   - Allowed types: PDF, JPG, PNG
   - Secure URL generation with expiry

## Implementation Notes

1. Email Verification:
   - Required for all admin/staff accounts
   - Verification link expires in 24 hours
   - Resend option available after 5 minutes

2. Document Verification:
   - Admin dashboard for document review
   - Automated OCR for basic validation
   - Manual verification required

3. Error Handling:
   - Detailed error messages for development
   - Generic messages in production
   - Error logging with request context

4. Audit Trail:
   - Log all authentication attempts
   - Track document access
   - Record profile changes 