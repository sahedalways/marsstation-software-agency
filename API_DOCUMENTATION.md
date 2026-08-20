# Mars Station Backend API Documentation

**Base URL:** `https://hp200397.marsstation.dev/api`

All responses are JSON. All endpoints are public (no auth required).

---

## Response Format

### Success
```json
{
    "success": true,
    "message": "Success",
    "data": { ... }
}
```

### Paginated
```json
{
    "success": true,
    "data": [ ... ],
    "meta": {
        "current_page": 1,
        "last_page": 3,
        "per_page": 15,
        "total": 42
    }
}
```

### Error
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."]
    }
}
```

### HTTP Status Codes
- `200` — Success
- `201` — Created
- `404` — Not Found
- `422` — Validation Error

---

## 1. SERVICES

### GET `/api/services` — List all services (paginated)
**Query params:** `per_page` (default 15, max 50)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "icon": "web",
            "title": "Web Development",
            "type": "website",
            "description": "We build modern websites...",
            "order_index": 1,
            "is_active": true,
            "bullet_points": [
                { "id": 1, "text": "Responsive design", "order_index": 1 }
            ],
            "projects": [
                {
                    "id": 1,
                    "title": "E-commerce Platform",
                    "type": "website",
                    "picture_path": "http://hp200397.marsstation.dev/storage/services/img.jpg",
                    "view_link": "https://example.com",
                    "order_index": 1
                }
            ],
            "created_at": "2026-01-01T00:00:00.000000Z"
        }
    ],
    "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 5 }
}
```

### GET `/api/services/active` — Active services only (paginated)
Same response as above, only `is_active: true` services.

### GET `/api/services/active-flat` — Active services (flat, no pagination)
**Response:**
```json
{
    "success": true,
    "data": [
        { "id": 1, "title": "Web Development", "type": "website", "icon": "web", "description": "..." }
    ],
    "message": "Active services retrieved"
}
```

### GET `/api/services/{id}` — Single service with bullet points + projects
**Response:** Single service object (same structure as above).

---

## 2. REVIEWS

### GET `/api/reviews` — Approved reviews only (paginated)
**Query params:** `per_page` (default 15, max 50)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "John Doe",
            "position": "CEO",
            "rating": 5,
            "description": "Excellent work...",
            "status": "approved",
            "dp_path": "http://hp200397.marsstation.dev/storage/reviews/avatar.jpg",
            "created_at": "2026-08-01T00:00:00.000000Z"
        }
    ],
    "meta": { ... }
}
```

### POST `/api/reviews` — Submit a review
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | YES | max 255 |
| `rating` | integer | YES | 1-5 |
| `description` | string | YES | max 2000 |
| `position` | string | no | max 255 |
| `dp` | file | no | image, jpg/jpeg/png/webp, max 2MB |

**Response (201):**
```json
{
    "success": true,
    "message": "Review submitted successfully. It will appear after admin approval.",
    "data": { "id": 1, "name": "John", "rating": 5, "status": "pending", ... }
}
```

---

## 3. GET SERVICES (Service Request)

### POST `/api/get-services` — Submit a service request
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `full_name` | string | YES | max 255 |
| `email` | string | YES | valid email, max 255 |
| `phone` | string | no | max 20 |
| `company` | string | no | max 255 |
| `preferred_contact` | string | no | `email` or `phone` |
| `selected_services` | array | no | array of strings |
| `selected_services[]` | string | no | max 255 each |
| `additional_notes` | string | no | max 5000 |
| `attachments` | file[] | no | multiple files |

**Response (201):**
```json
{
    "success": true,
    "message": "Service request submitted successfully",
    "data": {
        "id": 1,
        "full_name": "Jane Doe",
        "email": "jane@example.com",
        "status": "new",
        ...
    }
}
```

---

## 4. COMPLAINTS

### POST `/api/complaints` — Submit a complaint
**Content-Type:** `application/json`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `full_name` | string | YES | max 255 |
| `email` | string | YES | valid email, max 255 |
| `description` | string | YES | max 10000 |

**Response (201):**
```json
{
    "success": true,
    "message": "Complaint submitted successfully",
    "data": { "id": 1, "full_name": "John", "email": "john@example.com", "status": "new", ... }
}
```

---

## 5. QUERIES

### POST `/api/queries` — Submit a query
**Content-Type:** `application/json`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `full_name` | string | YES | max 255 |
| `email` | string | YES | valid email, max 255 |
| `query` | string | YES | max 10000 |
| `phone` | string | no | max 20 |
| `preferred_contact` | string | no | max 255 |
| `selected_services` | array | no | array of strings |
| `selected_services[]` | string | no | max 255 each |

**Response (201):**
```json
{
    "success": true,
    "message": "Query submitted successfully",
    "data": { "id": 1, "full_name": "Jane", "email": "jane@example.com", "status": "new", ... }
}
```

---

## 6. CHAT LEADS

### POST `/api/leads` — Capture a chat lead
**Content-Type:** `application/json`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | YES | max 255 |
| `email` | string | YES | valid email, max 255 |
| `agent` | string | no | max 255 |

**Response (201):**
```json
{
    "success": true,
    "message": "Chat lead captured successfully",
    "data": { "id": 1 }
}
```

---

## Frontend Migration Map

| Supabase Table | Backend Endpoint | Method |
|----------------|-----------------|--------|
| `testimonials` (read active) | `GET /api/reviews` | GET |
| `testimonials` (insert) | `POST /api/reviews` | POST |
| `service_requests` (insert) | `POST /api/get-services` | POST |
| `contact_submissions` (complaint) | `POST /api/complaints` | POST |
| `contact_submissions` (query) | `POST /api/queries` | POST |
| `chat_leads` (insert) | `POST /api/leads` | POST |
| `testimonials` (read all for admin) | `GET /api/reviews/all` | GET |
| `service_requests` (read for admin) | `GET /api/get-services` | GET |
