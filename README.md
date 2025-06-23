# Full Stack Product Catalog Platform

## Overview

This project is a modular, secure, and scalable product catalog system designed as a technical assessment for Full Stack Developer candidates. The solution consists of a **RESTful API backend** and a **React.js seller dashboard frontend**, complete documentation (Swagger + Postman), and written technical architecture answers.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Postman Collection](#postman-collection)
- [Environment Variables](#environment-variables)
- [Technical Decisions](#technical-decisions)
- [Contact](#contact)

---

## Features

### Backend (NestJS/Express.js)

- **Authentication System**
  - Register, Login, Profile, Token Refresh, Logout (JWT-based)
- **Product Management APIs**
  - Full CRUD for products, variants, inventory
  - Media upload (images & 3D models)
  - Reviews, ratings, promotion, SEO, tags
- **Secure File Upload**
- **Scalable & Modular Structure**

### Frontend (React.js)

- Seller dashboard for product management
- User authentication with token persistence
- Product list, create/edit/delete features
- Media upload (images & 3D)
- Review management
- Profile management
- Clean UI & responsive design

### Documentation & Testing

- **Swagger**: Auto-generated API docs
- **Postman**: Collection for all endpoints with environment variables
- **Markdown**: Written technical architecture answers

---

## Architecture

- **Backend**: [NestJS](https://nestjs.com/) (or Express.js), PostgreSQL/MongoDB, JWT
- **Frontend**: [React.js](https://react.dev/), Redux Toolkit, Axios, Formik/React Hook Form, MUI/Chakra UI
- **Media Storage**: ImageKit, Cloudinary, or S3
- **DevOps**: Docker, GitHub Actions

---

## Project Structure

```
project-root/
│
├── backend/
│   │── controllers/
│   │── services/
│   │── models/
│   │── routes/
│   │── ...
│   ├── test/
│   ├── swagger/
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   ├── .env.example
│   └── ...
│
├── docs/
│   ├── swagger.yaml / swagger.md
│   ├── postman_collection.json
│   └── technical_decisions.md
│
├── README.md
└── ...
```

---

## Installation

### Prerequisites

- Node.js >= 18.x
- pnpm >=10.10.0
- Docker (optional, for DB and local development, and Redis MemoryDB)
- PostgreSQL running instance

### Backend

```bash
cd backend
cp .env.example .env
pnpm install
pnpm prisma:generate # or prisma migrate, etc.
pnpm prisma:deploy
pnpm prisma:push
pnpm start:dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
yarn
yarm dev
```

---

## Usage

- Access backend API at: `http://localhost:3000/api`
- Access frontend dashboard at: `http://localhost:5173` (default React dev port)
- Use Swagger docs for endpoint testing and request/response examples.
- Use the provided Postman collection for manual API testing.

---

## API Documentation (Swagger)

- Auto-generated Swagger docs available at:  
  `http://localhost:3000/api/docs`  
- Includes:
  - Method + URL
  - Description
  - Required headers
  - Request/response examples
  - Error codes

---

## Postman Collection

- Find `postman_collection.json` in the `docs/` folder.
- Includes all endpoints:
  - Auth (Register, Login, Profile, Refresh, Logout)
  - Products (CRUD)
  - Media (Image & 3D Model upload)
  - Variants (CRUD)
  - Reviews (CRUD)
- Use environment variables for tokens and base URL.

---

## Environment Variables

### Backend `.env.example`
```
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/catalog
JWT_SECRET=mysecret
REFRESH_TOKEN_SECRET=myrefreshsecret
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
```

### Frontend `.env.example`
```
REACT_APP_API_URL=http://localhost:3000/api
```

---

## Technical Decisions

- Please see [`docs/technical_decisions.md`](docs/technical_decisions.md) for detailed answers to:
  - Scalability & Performance
  - Security
  - Internationalization
  - Analytics
  - Stack Justification

---

## Contact

For any questions, please reach out to the project author or raise an issue.

---

**Good luck and happy coding!**
