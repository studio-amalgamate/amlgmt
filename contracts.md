# Backend & Frontend Integration Contracts

## Database Models

### User Model
```python
{
  "_id": ObjectId,
  "username": string,
  "password": string (hashed),
  "created_at": datetime
}
```

### Project Model
```python
{
  "_id": ObjectId,
  "id": string (slug),
  "title": string,
  "client": string,
  "date": string,
  "location": string,
  "description": string,
  "media": [
    {
      "type": "image" | "video",
      "url": string,
      "alt": string,
      "order": int
    }
  ],
  "featured": boolean,
  "created_at": datetime,
  "updated_at": datetime
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
  - Request: `{ username, password }`
  - Response: `{ token, user: { username } }`
  
- `POST /api/auth/register` - Register first admin (protected after first user)
  - Request: `{ username, password }`
  - Response: `{ message, user: { username } }`

### Projects
- `GET /api/projects` - Get all projects (public)
  - Response: `[{ id, title, client, date, location, description, media, featured }]`

- `GET /api/projects/:id` - Get single project (public)
  - Response: `{ id, title, client, date, location, description, media, featured }`

- `POST /api/projects` - Create project (protected)
  - Request: `{ title, client, date, location, description, featured }`
  - Response: `{ project }`

- `PUT /api/projects/:id` - Update project (protected)
  - Request: `{ title, client, date, location, description, featured }`
  - Response: `{ project }`

- `DELETE /api/projects/:id` - Delete project (protected)
  - Response: `{ message }`

### Media Upload
- `POST /api/projects/:id/media` - Upload media to project (protected)
  - Request: FormData with file
  - Response: `{ media: { type, url, alt, order } }`

- `DELETE /api/projects/:id/media/:mediaId` - Delete media (protected)
  - Response: `{ message }`

- `PUT /api/projects/:id/media/reorder` - Reorder media (protected)
  - Request: `{ mediaOrder: [{ id, order }] }`
  - Response: `{ project }`

### Featured Images
- `GET /api/featured` - Get all featured images (public)
  - Response: `[{ url, projectId, projectTitle, type, alt }]`

## Frontend Integration Plan

### Current Mock Data (mock.js)
- 8 projects with sample images
- Featured flag on some projects
- Media array with type and URL

### Backend Integration Changes

1. **API Service Layer** (src/services/api.js)
   - axios instance with base URL
   - Authentication interceptor
   - Project fetching methods
   - Admin methods (CRUD)

2. **Auth Context** (src/context/AuthContext.jsx)
   - Login/logout functionality
   - Token management
   - Protected routes

3. **Admin Dashboard** (src/pages/Admin/)
   - Login page
   - Projects list/management
   - Project create/edit forms
   - Media upload interface

4. **Replace Mock Data**
   - Home.jsx: fetch featured images from API
   - Project.jsx: fetch project by ID from API
   - Sidebar.jsx: fetch all projects from API

## File Upload Strategy
- Store files in `/app/backend/uploads/` directory
- Serve files statically via FastAPI
- File naming: `{timestamp}_{original_name}`
- Supported formats: jpg, jpeg, png, gif, webp, mp4, mov, avi

## Authentication Flow
1. Admin navigates to `/admin/login`
2. Submits username/password
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token sent in Authorization header for protected routes
6. Token verified on backend for each protected request
