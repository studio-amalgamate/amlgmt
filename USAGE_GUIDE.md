# Photography Portfolio CMS - Complete Guide

## 🎉 Project Complete!

You now have a fully functional CMS-based photography portfolio with:
- ✅ Beautiful responsive frontend (desktop & mobile)
- ✅ Full backend API with authentication
- ✅ Admin panel for managing projects and media
- ✅ MongoDB database integration

---

## 📍 Access Points

### Public Portfolio
- **URL**: http://localhost:3000
- **Features**: 
  - Homepage with featured images slideshow
  - Project list in sidebar
  - Individual project pages with slideshows
  - Information modal
  - Fully responsive (mobile & desktop)

### Admin Panel
- **URL**: http://localhost:3000/admin/login
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin123`

---

## 🚀 Getting Started

### First Time Setup

1. **Register Admin Account** (only first user can register):
   ```bash
   curl -X POST http://localhost:8001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

2. **Login to Admin Panel**:
   - Go to http://localhost:3000/admin/login
   - Enter username and password
   - You'll be redirected to the dashboard

3. **Create Your First Project**:
   - Click "New Project" button
   - Fill in project details (title, client, date, location)
   - Check "Featured" if you want it on homepage
   - Click "Create Project"

4. **Upload Media**:
   - After creating project, you'll see the upload section
   - Click the upload area or drag & drop images/videos
   - Supported formats: JPG, PNG, GIF, WEBP, MP4, MOV, AVI
   - Media will appear in order uploaded

5. **View on Public Site**:
   - Go to http://localhost:3000
   - Your project will appear in the sidebar
   - Featured images will show on homepage

---

## 📝 Admin Panel Features

### Dashboard
- View all projects
- See project stats (media count, featured status)
- Quick edit/delete buttons
- Create new projects

### Project Editor
- **Project Details**:
  - Title (required)
  - Client name
  - Date (e.g., "January 2025")
  - Location
  - Description
  - Featured checkbox (shows on homepage)

- **Media Management**:
  - Upload multiple images/videos at once
  - View thumbnails
  - Delete media with hover button
  - Order is based on upload sequence
  - Videos display first in slideshows

---

## 🎨 Customization

### Change Site Name
Edit `/app/frontend/src/components/Sidebar.jsx` and `/app/frontend/src/components/InfoModal.jsx`:
```jsx
// Replace "Your Name" with your actual name
<h1>Your Actual Name</h1>
```

### Update About Section
Edit `/app/frontend/src/components/InfoModal.jsx`:
- Update bio text
- Add contact information
- Update client list
- Add Instagram link

### Change Colors/Styling
Main files:
- `/app/frontend/src/App.css` - Global styles
- `/app/frontend/src/index.css` - Tailwind config
- Component files for specific styling

---

## 🔧 Technical Details

### Frontend Stack
- React 19
- React Router for navigation
- Axios for API calls
- Tailwind CSS + shadcn/ui components
- Responsive design (mobile-first)

### Backend Stack
- FastAPI (Python)
- MongoDB with Motor (async driver)
- JWT authentication
- File upload handling
- RESTful API architecture

### Database Schema

**Users Collection**:
```json
{
  "username": "admin",
  "password": "<hashed>",
  "created_at": "2025-01-19T..."
}
```

**Projects Collection**:
```json
{
  "id": "project-slug",
  "title": "Project Title",
  "client": "Client Name",
  "date": "January 2025",
  "location": "Mumbai",
  "description": "...",
  "media": [
    {
      "id": "uuid",
      "type": "image",
      "url": "/uploads/file.jpg",
      "alt": "filename",
      "order": 0
    }
  ],
  "featured": true,
  "created_at": "...",
  "updated_at": "..."
}
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register first admin
- `POST /api/auth/login` - Login (returns JWT token)

### Projects (Public)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `GET /api/featured` - Get featured images

### Projects (Protected - Requires Auth)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Media (Protected)
- `POST /api/projects/:id/media` - Upload media
- `DELETE /api/projects/:id/media/:mediaId` - Delete media
- `PUT /api/projects/:id/media/reorder` - Reorder media

---

## 📂 File Structure

```
/app/
├── backend/
│   ├── server.py          # Main API server
│   ├── models.py          # Pydantic models
│   ├── auth.py            # JWT authentication
│   ├── utils.py           # Helper functions
│   ├── uploads/           # Uploaded media files
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Slideshow.jsx
│   │   │   ├── InfoModal.jsx
│   │   │   └── ui/        # shadcn components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Project.jsx
│   │   │   └── Admin/
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       └── ProjectEditor.jsx
│   │   ├── services/
│   │   │   └── api.js     # API service layer
│   │   └── App.js
│   └── package.json
│
└── contracts.md           # API documentation
```

---

## 🐛 Troubleshooting

### Issue: Can't login to admin
**Solution**: Make sure you've registered a user first using the curl command above

### Issue: Images not showing
**Solution**: 
1. Check if files are in `/app/backend/uploads/`
2. Verify backend is running: `curl http://localhost:8001/api/health`
3. Check browser console for CORS errors

### Issue: Frontend shows "No projects yet"
**Solution**: 
1. Login to admin panel
2. Create a project
3. Upload media to the project
4. Check if featured checkbox is enabled for homepage

### Issue: Upload fails
**Solution**:
1. Check file size (large files may timeout)
2. Verify file format is supported
3. Check backend logs: `tail -f /var/log/supervisor/backend.*.log`

---

## 🔒 Security Notes

### Production Checklist
Before deploying to production:

1. **Change Secret Key**:
   - Edit `/app/backend/.env`
   - Set `SECRET_KEY` to a random string (32+ characters)

2. **Update CORS Settings**:
   - Edit `/app/backend/server.py`
   - Change `allow_origins=["*"]` to your actual domain

3. **Use HTTPS**:
   - Configure SSL certificates
   - Update all URLs to use https://

4. **Change Admin Password**:
   - Login to admin panel
   - Or create new admin user with strong password

5. **Environment Variables**:
   - Never commit `.env` files to git
   - Use environment-specific configs

---

## 📊 Monitoring

### Check Service Status
```bash
sudo supervisorctl status
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.*.log

# Frontend logs
tail -f /var/log/supervisor/frontend.*.log
```

### Restart Services
```bash
# Restart backend
sudo supervisorctl restart backend

# Restart frontend
sudo supervisorctl restart frontend

# Restart all
sudo supervisorctl restart all
```

---

## 🎯 Next Steps

1. **Customize Content**:
   - Update site name and branding
   - Write your bio
   - Add contact information

2. **Add Projects**:
   - Create your photography projects
   - Upload high-quality images
   - Mark favorites as featured

3. **Test Everything**:
   - Test on different devices
   - Check mobile responsiveness
   - Test all interactions

4. **Optional Deployment**:
   - Choose hosting provider
   - Set up domain name
   - Configure production environment

---

## 💡 Tips

- **Image Quality**: Use high-resolution images (at least 1920px wide) for best results
- **File Naming**: Use descriptive filenames for better organization
- **Featured Projects**: Select 3-5 best projects as featured for homepage impact
- **Order Matters**: Upload images in the order you want them displayed
- **Videos First**: Videos automatically appear before images in slideshows
- **Mobile Testing**: Always check how projects look on mobile devices

---

## 📞 Support

If you encounter any issues or need help:
1. Check the troubleshooting section above
2. Review the API documentation in `/app/contracts.md`
3. Check browser console and backend logs
4. Review test results in `/app/test_result.md`

---

## 🎉 Enjoy Your Portfolio!

Your photography portfolio CMS is ready to use. Start uploading your work and share your art with the world!
