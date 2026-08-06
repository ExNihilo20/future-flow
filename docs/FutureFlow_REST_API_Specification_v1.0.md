# FutureFlow REST API Specification

**Version:** 1.0  
**Project:** FutureFlow – Predictive Cash Flow & Scenario Planner

## Purpose

Defines the initial REST API endpoints for FutureFlow. APIs are JSON-based and versioned under `/api/v1`.

## Authentication

JWT Bearer authentication protects all endpoints except registration and login.

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register | No |
| POST | `/auth/login` | Login | No |
| GET | `/users/me` | Current user | Yes |
| GET | `/accounts` | List accounts | Yes |
| POST | `/accounts` | Create account | Yes |
| GET | `/transactions` | List transactions | Yes |
| POST | `/transactions/import` | Import CSV | Yes |
| POST | `/transactions` | Create transaction | Yes |
| PUT | `/transactions/{id}` | Update transaction | Yes |
| DELETE | `/transactions/{id}` | Delete transaction | Yes |
| GET | `/forecast` | Cash-flow forecast | Yes |
| POST | `/forecast/recalculate` | Recalculate forecast | Yes |
| GET | `/scenarios` | List scenarios | Yes |
| POST | `/scenarios` | Create scenario | Yes |
| GET | `/goals` | List goals | Yes |
| POST | `/goals` | Create goal | Yes |
| GET | `/subscriptions` | Subscriptions | Yes |
| GET | `/insights` | AI insights | Yes |

## Standard Response

Success:

```json
{"success": true, "data": {}}
```

Error:

```json
{"success": false, "message": "...", "errors": []}
```

## HTTP Status Codes

| Code | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## API Design Principles

- RESTful resources
- JSON payloads
- Stateless services
- Versioned APIs
- Consistent error handling
- OpenAPI/Swagger documentation
