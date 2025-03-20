# Customer Analytics & Billing Portal API Specification

## Overview

This API provides endpoints for managing customer accounts, billing information, proposals, invoices, and analytics data. The API is designed to support role-based access control with administrative and customer user roles.

## Authentication

All API endpoints require authentication through one of the following methods:

1. Session-based authentication (cookie)
2. JWT token authentication
3. Two-factor authentication for enhanced security

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate with email and password |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/logout` | Logout and invalidate the current session |
| POST | `/auth/refresh` | Refresh the current session |
| POST | `/auth/password-reset` | Request a password reset email |
| POST | `/auth/password-reset/confirm` | Confirm password reset with token |
| POST | `/auth/verify-2fa` | Verify TOTP code for 2FA |
| POST | `/auth/enable-2fa` | Enable 2FA for user account |
| GET | `/auth/2fa-status` | Check if 2FA is enabled |
| POST | `/auth/request-code` | Request verification code via email or SMS |
| POST | `/auth/verify-code` | Verify code and authenticate user |

## User Management

Endpoints for managing user profiles and settings.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update current user profile |
| PUT | `/users/me/settings` | Update user settings |

## Customer Management

Endpoints for managing customer accounts and associated data.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/customers` | Create a new customer account | Admin |
| GET | `/customers` | Get all customers | Admin |
| GET | `/customers/me` | Get current user's customer | Customer |
| GET | `/customers/{customer_id}` | Get a customer by ID | Admin/Customer owner |
| PUT | `/customers/{customer_id}` | Update a customer | Admin/Customer owner |
| DELETE | `/customers/{customer_id}` | Delete a customer | Admin |
| GET | `/customers/{customer_id}/billing` | Get a customer's billing settings | Admin/Customer owner |
| PUT | `/customers/{customer_id}/billing` | Update customer billing settings | Admin |
| POST | `/customers/{customer_id}/users` | Create a new user for a customer | Admin |
| GET | `/customers/{customer_id}/users` | Get all users for a customer | Admin/Customer owner |

## Billing & Invoicing

Endpoints for managing billing, invoices, and payments.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/billing/stats` | Get overall billing statistics | Admin |
| GET | `/billing/customer/{customer_id}/overview` | Get customer billing overview | Admin/Customer owner |
| GET | `/billing/my-billing` | Get current user's customer billing overview | Customer |
| GET | `/billing/invoices/customer/{customer_id}` | Get customer invoices | Admin/Customer owner |
| GET | `/billing/invoices/{invoice_id}` | Get an invoice by ID | Admin/Invoice owner |
| PUT | `/billing/invoices/{invoice_id}/infrastructure-costs` | Update infrastructure costs | Admin |
| POST | `/billing/payment-methods/setup` | Create setup intent for payment method | Customer |
| GET | `/billing/payment-methods/customer/{customer_id}` | Get customer payment methods | Admin/Customer owner |
| POST | `/billing/pay-invoice` | Pay an invoice using Stripe | Admin/Customer owner |
| POST | `/billing/generate-from-proposal` | Generate invoices from proposal | Admin |
| POST | `/billing/generate-recurring` | Generate recurring invoice | Admin |
| POST | `/billing/webhooks/stripe` | Stripe webhook handler | Public with signature verification |

## Proposals

Endpoints for managing sales proposals with staggered billing schedules.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/proposals` | Create a new proposal | Admin |
| GET | `/proposals/customer/{customer_id}` | Get customer proposals | Admin/Customer owner |
| GET | `/proposals/{proposal_id}` | Get a proposal by ID | Admin/Proposal owner |
| PUT | `/proposals/{proposal_id}` | Update a proposal | Admin |
| DELETE | `/proposals/{proposal_id}` | Delete a proposal | Admin |
| POST | `/proposals/{proposal_id}/accept` | Accept a proposal | Admin (on behalf of customer) |
| POST | `/proposals/{proposal_id}/reject` | Reject a proposal | Admin (on behalf of customer) |

## Analytics Dashboard

Endpoints for retrieving and managing analytics data.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics-dashboard/customer/{customer_id}` | Get customer analytics | Admin/Customer owner |
| GET | `/analytics-dashboard/my-analytics` | Get current user's analytics | Customer |

## Health Checks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Basic health check endpoint |

## Data Models

### Customer

```json
{
  "id": "uuid",
  "name": "string",
  "company_name": "string",
  "status": "active|inactive|onboarding|pending",
  "billing_email": "string",
  "phone": "string (optional)",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postal_code": "string",
    "country": "string"
  },
  "firebase_app_id": "string (optional)",
  "firebase_project_id": "string (optional)",
  "stripe_customer_id": "string (optional)",
  "created_at": "datetime",
  "updated_at": "datetime",
  "billing_settings": {
    // See BillingSettings model
  }
}
```

### BillingSettings

```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "payment_method": "credit_card|bank_transfer|paypal|stripe|manual",
  "billing_frequency": "monthly|quarterly|annual|one_time",
  "monthly_fee": "float",
  "currency": "string (USD)",
  "billing_day": "integer (1-31)",
  "auto_charge": "boolean",
  "tax_rate": "float",
  "payment_terms_days": "integer",
  "stripe_payment_method_id": "string (optional)",
  "additional_details": "json (optional)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Proposal

```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "title": "string",
  "description": "string (optional)",
  "status": "draft|sent|accepted|rejected|expired",
  "total_amount": "float",
  "currency": "string (USD)",
  "billing_schedule": [
    {
      "percentage": "float",
      "milestone": "string",
      "due_days": "integer (optional)"
    }
  ],
  "valid_until": "datetime (optional)",
  "monthly_recurring_amount": "float",
  "created_at": "datetime",
  "updated_at": "datetime",
  "accepted_at": "datetime (optional)",
  "rejected_at": "datetime (optional)"
}
```

### Invoice

```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "proposal_id": "uuid (optional)",
  "invoice_number": "string",
  "status": "draft|pending|paid|overdue|cancelled",
  "amount": "float",
  "tax_amount": "float",
  "total_amount": "float",
  "currency": "string (USD)",
  "issue_date": "datetime",
  "due_date": "datetime",
  "paid_date": "datetime (optional)",
  "description": "string (optional)",
  "infrastructure_costs": "float",
  "milestone": "string (optional)",
  "line_items": [
    {
      "description": "string",
      "quantity": "integer",
      "unit_price": "float",
      "amount": "float"
    }
  ],
  "payment_method": "string (optional)",
  "stripe_invoice_id": "string (optional)",
  "stripe_payment_intent_id": "string (optional)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### AnalyticsMetrics

```json
{
  "daily_active_users": "integer",
  "monthly_active_users": "integer",
  "new_users": "integer",
  "total_users": "integer",
  "retention_rate": "float",
  "engagement_rate": "float",
  "average_session_duration": "float",
  "sessions_per_user": "float",
  "events_per_user": "float",
  "most_active_features": [
    {
      "feature": "string",
      "usage_count": "integer"
    }
  ],
  "device_breakdown": {
    "ios": "float (percentage)",
    "android": "float (percentage)",
    "web": "float (percentage)",
    "other": "float (percentage)"
  },
  "user_growth_trend": [
    {
      "date": "string (YYYY-MM-DD)",
      "users": "integer"
    }
  ],
  "data_timeframe": {
    "start_date": "string (YYYY-MM-DD)",
    "end_date": "string (YYYY-MM-DD)"
  }
}
```

## Error Handling

All API errors follow a consistent structure:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

## Rate Limiting

Most endpoints have rate limiting applied to prevent abuse:

- Authentication endpoints: 3-5 requests per minute
- User profile endpoints: 10-30 requests per minute
- Read operations: 30-60 requests per minute
- Write operations: 10-20 requests per minute

## Environment Variables

The following environment variables are required for integrations:

```
# Firebase Analytics
FIREBASE_CREDENTIALS=path/to/firebase-credentials.json
FIREBASE_API_KEY=your-firebase-api-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_API_VERSION=2023-10-16
```

## Security Features

- CSRF protection
- Content Security Policy (CSP) headers
- Rate limiting
- Two-factor authentication
- Password reset with secure tokens
- Session management with automatic expiration
- Role-based access control
- Customer data isolation