# LinkPulse Backend — Frontend API Contract & Integration Guide

Version: `1.0.0`  
Base API URL: `/api/v1/`  
Public Short Link Base URL: `https://linkpulse.app/` or `http://localhost:8000/`  

---

## 1. Global API Response Standards

### Success Response Format
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "The provided URL is invalid or uses an unsupported scheme.",
    "details": {}
  }
}
```

### Common Error Codes
- `INVALID_URL` (HTTP 400): Destination URL is invalid or unallowed protocol scheme.
- `CUSTOM_ALIAS_TAKEN` (HTTP 400): Custom alias is already in use or reserved.
- `INVALID_SHORT_CODE` / `NOT_FOUND` (HTTP 404): Short link or resource not found.
- `LINK_DISABLED` (HTTP 403): Short link is disabled (`is_active = false`).
- `LINK_EXPIRED` (HTTP 410): Short link expired (`expires_at <= now`).
- `WORKSPACE_ACCESS_DENIED` (HTTP 403): User lacks permission to access workspace/link.
- `THROTTLED` (HTTP 429): Rate limit exceeded.

---

## 2. Authentication (`/api/v1/auth/`)

### Register User
- **Method**: `POST`
- **Path**: `/api/v1/auth/register/`
- **Auth**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "Jane",
  "last_name": "Doe",
  "workspace_name": "Acme Marketing"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "is_active": true,
      "date_joined": "2026-10-01T20:00:00Z"
    },
    "workspace": {
      "id": "uuid",
      "name": "Acme Marketing",
      "slug": "acme-marketing"
    },
    "tokens": {
      "access": "eyJhbGciOi...",
      "refresh": "eyJhbGciOi..."
    }
  }
}
```

---

### Login User
- **Method**: `POST`
- **Path**: `/api/v1/auth/login/`
- **Auth**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "tokens": { "access": "eyJhbG...", "refresh": "eyJhbG..." }
  }
}
```

---

### Refresh Access Token
- **Method**: `POST`
- **Path**: `/api/v1/auth/refresh/`
- **Auth**: None
- **Request Body**:
```json
{
  "refresh": "eyJhbGciOi..."
}
```
- **Response (200 OK)**:
```json
{
  "access": "eyJhbGciOi..."
}
```

---

### Get Authenticated User Details
- **Method**: `GET`
- **Path**: `/api/v1/auth/me/`
- **Auth**: `Bearer <access_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe"
  }
}
```

---

## 3. Workspaces (`/api/v1/workspaces/`)

### List User Workspaces
- **Method**: `GET`
- **Path**: `/api/v1/workspaces/`
- **Auth**: `Bearer <access_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "uuid",
        "name": "Acme Marketing",
        "slug": "acme-marketing",
        "owner": "uuid",
        "role": "OWNER",
        "member_count": 1
      }
    ]
  }
}
```

---

## 4. Short Links (`/api/v1/links/`)

### Create Short Link
- **Method**: `POST`
- **Path**: `/api/v1/links/`
- **Auth**: `Bearer <access_token>`
- **Request Body**:
```json
{
  "original_url": "https://example.com/product-launch",
  "title": "Q1 Launch Page",
  "custom_alias": "launch2026",
  "workspace_id": "uuid",
  "campaign_id": "uuid",
  "expires_at": null
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workspace": "uuid",
    "campaign": "uuid",
    "short_code": "launch2026",
    "short_url": "http://localhost:8000/launch2026",
    "original_url": "https://example.com/product-launch",
    "title": "Q1 Launch Page",
    "is_active": true,
    "expires_at": null,
    "is_expired": false,
    "click_count": 0,
    "created_at": "2026-10-01T20:00:00Z"
  }
}
```

---

### Generate QR Code PNG Image
- **Method**: `GET`
- **Path**: `/api/v1/links/{id}/qr/`
- **Auth**: `Bearer <access_token>`
- **Response Headers**: `Content-Type: image/png`

---

## 5. Analytics (`/api/v1/analytics/`)

### Overview Dashboard Stats
- **Method**: `GET`
- **Path**: `/api/v1/analytics/overview/?workspace_id=uuid`
- **Auth**: `Bearer <access_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total_clicks": 12842,
    "unique_visitors": 8421,
    "active_links": 24,
    "bot_clicks": 321,
    "clicks_today": 421,
    "clicks_this_week": 3201,
    "clicks_this_month": 12842
  }
}
```

---

### Link Full Analytics Breakdown
- **Method**: `GET`
- **Path**: `/api/v1/analytics/links/{link_id}/?range=30d`
- **Auth**: `Bearer <access_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "link": {
      "id": "uuid",
      "short_code": "launch2026",
      "original_url": "https://example.com/product-launch",
      "title": "Q1 Launch Page"
    },
    "summary": {
      "total_clicks": 1200,
      "unique_visitors": 850,
      "bot_clicks": 40,
      "human_clicks": 1160
    },
    "timeline": [
      { "date": "2026-09-01", "clicks": 42, "unique_visitors": 30 }
    ],
    "countries": [
      { "country": "United States", "clicks": 520, "percentage": 43.3 },
      { "country": "India", "clicks": 410, "percentage": 34.2 }
    ],
    "devices": {
      "counts": { "desktop": 700, "mobile": 460, "tablet": 0, "bot": 40 },
      "percentages": { "desktop": 58.3, "mobile": 38.3, "tablet": 0.0, "bot": 3.3 }
    },
    "referrers": [
      { "source": "linkedin.com", "clicks": 620 },
      { "source": "google.com", "clicks": 310 }
    ],
    "insights": [
      "linkedin.com generated 620 clicks, making it your top traffic source."
    ],
    "anomalies": []
  }
}
```

---

### Export Click Data CSV
- **Method**: `GET`
- **Path**: `/api/v1/analytics/links/{link_id}/export/?format=csv`
- **Auth**: `Bearer <access_token>`
- **Response Headers**: `Content-Type: text/csv`

---

## 6. Public Redirect Engine (`GET /<short_code>`)

- **Method**: `GET`
- **Path**: `/{short_code}` (e.g. `GET /launch2026`)
- **Auth**: Public
- **Behavior**: Fast 302 redirect to `original_url`. Sets `lp_vid` visitor tracking cookie (`SameSite=Lax`, `HttpOnly=True`). Async click metadata processing via Celery.
