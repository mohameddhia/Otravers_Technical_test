# Technical Architecture Decisions

**Repository:** [mohameddhia/Otravers_Technical_test](https://github.com/mohameddhia/Otravers_Technical_test)  
**Tech Stack:** TypeScript (57.7%), JavaScript (41.6%)  
**Prepared by:** mohameddhia  
**Date:** 2025-06-23 19:03:22 UTC

---

## Q1: Scalability & Performance

**How would you optimize `/products/search` and `/products/trending` for a platform with 100K+ products?**

- **Database Indexing:**  
  Indexed searchable fields (e.g., name, category, tags, promoted) to speed up queries.
- **Full Text Search:**  
  Used database text search features (e.g., MongoDB text indexes or PostgreSQL tsvector) for fast and flexible search.
- **Pagination & Limits:**  
  Implemented efficient pagination on the backend and frontend; limited response size to avoid large data scans.
- **Caching:**  
  Used client-side (Redux persist/localStorage) and recommended server-side (Redis) caching for frequent/trending queries.
- **Trending Calculation:**  
  Suggested precomputing trending products periodically in a background job and caching the results.
- **Background Processing:**  
  Offloaded analytics and trending score computation to background workers when scaling up.

---

## Q2: Security

**How do you protect token refresh endpoints?**

- **HTTP-Only Cookies:**  
  (Recommended) Use secure, HTTP-only cookies for storing refresh tokens to mitigate XSS.
- **Token Rotation:**  
  Refresh tokens are rotated and invalidated after use.
- **Rate Limiting:**  
  Recommended strict rate limits on refresh endpoints to prevent abuse.
- **Short Expiry:**  
  Used short-lived access tokens and reasonably short refresh token lifetimes.
- **Blacklist on Logout:**  
  Tokens are invalidated or blacklisted on logout.

**What measures do you take for secure file uploads?**

- **File Type Validation:**  
  Allowed only specific MIME types/extensions (e.g. JPEG, PNG, glTF).
- **Size Checks:**  
  Enforced strict file size limits on both client and server.
- **Random File Names:**  
  Stored files with random/hashed names to prevent path traversal.
- **Isolated Storage:**  
  Used external services (e.g., ImageKit, S3) with restricted access for media storage.
- **No Direct Execution:**  
  Served media files from CDN or storage endpoints, not the application server.

---

## Q3: Internationalization

**How would you implement multi-language support for product fields (name, description)?**

- **Schema Design:**  
  Product fields like name and description are objects with language codes as keys, e.g.:
  ```json
  {
    "name": { "en": "Sneakers", "fr": "Baskets" },
    "description": { "en": "Comfortable shoes", "fr": "Chaussures confortables" }
  }
  ```
- **API Layer:**  
  API accepts a `lang` parameter; returns the desired language or falls back to default.
- **Frontend:**  
  Ready for integration with libraries like `react-i18next` for UI translation and passing language preference to API.

---

## Q4: Analytics

**How would you track product views, analyze trends, and compute ratings efficiently?**

- **Views:**  
  Product views incremented in a fast in-memory store (e.g., Redis) and batched to DB.
- **Trending:**  
  Trending score calculated with weighted sum of views, ratings, recency, and cached for fast access.
- **Rating Storage:**  
  Reviews stored per product; average rating and count updated with each new review for fast reads.
- **Analytics Storage:**  
  For large scale, raw events can be streamed into analytics DBs (e.g., Clickhouse or BigQuery) for dashboarding and deeper trend analysis.

---

## Q5: Recommended Stack – Justify Your Toolset

| Area               | Your Stack                    | Why                                                                                      |
|--------------------|------------------------------|------------------------------------------------------------------------------------------|
| Backend Framework  | Express.js + TypeScript      | Clean, modular, type-safe, and async-ready; codebase leverages strong TypeScript usage.  |
| Frontend Framework | React.js + Redux Toolkit     | Modern, component-driven, excellent state management and developer experience.           |
| Database           | PostgreSQL                      | Flexible schema for product variants, media, and i18n fields.                            |
| File Storage       | ImageKit (or S3, Cloudinary) | Secure storage, fast CDN delivery, and image transformation capabilities.                |
| Auth & Security    | JWT (access/refresh), HTTP-only cookies, rate-limiting | Secure, stateless auth; mitigates XSS/CSRF and brute-force.        |
| DevOps             | GitHub, Docker               | Source control, CI/CD, reproducible deployments.                                         |

---

## Submission Checklist

- [x] GitHub repo: [mohameddhia/Otravers_Technical_test](https://github.com/mohameddhia/Otravers_Technical_test)
- [x] Structured folders: backend/, frontend/, docs/
- [x] API documentation: Swagger & Markdown
- [x] Postman collection: `docs/postman_collection.json`
- [x] This technical_decisions.md
- [x] README with installation, usage, Swagger, .env.example

---