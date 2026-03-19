# 📩 Anonymous Messaging System API

A security-focused messaging system backend built with Node.js, Express, and MongoDB.

The project simulates real-world messaging applications with a strong emphasis on security, clean architecture, and scalability.

---

## 🚀 Features

- 🔐 Encrypted messaging (only sender & receiver can decrypt)
- 📥 Inbox & 📤 Sent messages handling
- 🔑 JWT Authentication & Authorization
- 🔢 OTP generation for secure verification
- ✅ Input validation using Joi
- 📎 File upload validation
- 🧩 Modular architecture (Controller → Service → Model)
- ⚡ RESTful API design

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Joi Validation
- JWT Authentication

---
## 🧠 Security Highlights

- Message content is encrypted and cannot be accessed without proper keys
- OTP system for secure verification
- Input validation to prevent invalid or malicious data
- File upload validation for safe media handling
- Protected routes using JWT

---


# Sara7a App API Documentation

> Base URL: `{{baseUrl}}`

---

## Auth Endpoints

| Method | Endpoint | Description | Body Example | Response Example |
|--------|---------|-------------|--------------|----------------|
| ![POST](https://img.shields.io/badge/POST-blue) POST | `/api/auth/signup` | Register a new user | ```json { "username": "Dina elsherbiny", "email": "dinaelsherbiny@example.com", "password": "password123" }``` | ```json { "message": "User created successfully", "data": {...} }``` |
| ![POST](https://img.shields.io/badge/POST-blue) POST | `/api/auth/confirm-otp` | Confirm OTP after signup | ```json { "email": "MariamMagdy@example.com", "otp": "929694" }``` | ```json { "message": "OTP confirmed" }``` |
| ![POST](https://img.shields.io/badge/POST-blue) POST | `/api/auth/login` | Login user | ```json { "email": "user@example.com", "password": "password123" }``` | ```json { "token": "...", "refreshToken": "..." }``` |

---

## User Endpoints

| Method | Endpoint | Description | Body Example | Response Example |
|--------|---------|-------------|--------------|----------------|
| ![GET](https://img.shields.io/badge/GET-brightgreen) GET | `/api/user/profile` | Get user profile | - | ```json { "username": "...", "email": "..." }``` |
| ![DELETE](https://img.shields.io/badge/DELETE-red) DELETE | `/api/user/profile` | Delete user profile | - | ```json { "message": "Profile deleted" }``` |
| ![PATCH](https://img.shields.io/badge/PATCH-yellow) PATCH | `/api/user/profile` | Update profile | ```json { "email": "marya1108@example.com", "username": "maryam" }``` | ```json { "message": "Profile updated" }``` |
| ![PATCH](https://img.shields.io/badge/PATCH-yellow) PATCH | `/api/user/profile/password` | Change password | ```json { "currentPassword":"password123", "newPassword":"todo123456" }``` | ```json { "message": "Password changed" }``` |
| ![PATCH](https://img.shields.io/badge/PATCH-yellow) PATCH | `/api/user/profile/profile-picture` | Upload profile picture | FormData file: `image` | ```json { "message": "Profile picture updated" }``` |

> **Note:** All User endpoints require `Authorization` header with Bearer token.

---

## Message Endpoints

| Method | Endpoint | Description | Body Example | Response Example |
|--------|---------|-------------|--------------|----------------|
| ![POST](https://img.shields.io/badge/POST-blue) POST | `/api/message/{{receiverId}}` | Send a message | ```json { "content":"Heloo dandonaaa" }``` | ```json { "message": "Message sent" }``` |
| ![POST](https://img.shields.io/badge/POST-blue) POST | `/api/message/anonymous/{{receiverId}}` | Send anonymous message | ```json { "content":"hello dandonnnaa ana anonymous" }``` | ```json { "message": "Anonymous message sent" }``` |
| ![GET](https://img.shields.io/badge/GET-brightgreen) GET | `/api/messages/{{id}}` | Get message by id | - | ```json { "content": "...", "senderId": "..."} ``` |
| ![DELETE](https://img.shields.io/badge/DELETE-red) DELETE | `/api/messages/{{id}}` | Delete message by id | - | ```json { "message": "Message deleted" }``` |
| ![DELETE](https://img.shields.io/badge/DELETE-red) DELETE | `/api/messages/` | Delete all messages | - | ```json { "message": "All messages deleted" }``` |
| ![GET](https://img.shields.io/badge/GET-brightgreen) GET | `/api/message/inbox` | Get received messages | - | ```json { "messages": [...] }``` |
| ![GET](https://img.shields.io/badge/GET-brightgreen) GET | `/api/message/inbox/unread` | Get unread messages | - | ```json { "messages": [...] }``` |
| ![GET](https://img.shields.io/badge/GET-brightgreen) GET | `/api/message/sent` | Get sent messages | - | ```json { "messages": [...] }``` |
| ![PATCH](https://img.shields.io/badge/PATCH-yellow) PATCH | `/api/message/:messageId/read` | Mark message as read | - | ```json { "message": "Message marked as read" }``` |

> **Note:** All Message endpoints (except anonymous) require `Authorization` header with Bearer token.

---

## How to use

1. Replace `{{baseUrl}}` with your API server URL.  
2. Include `Authorization` header for protected endpoints:

```http
Authorization: Bearer <token>
