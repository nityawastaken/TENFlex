# TENFlex Backend Integration Guide

This guide explains how to integrate your Next.js frontend with the Django backend.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your frontend root directory:

```bash
# Django Backend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Frontend Configuration
NEXT_PUBLIC_APP_NAME=TENFlex
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Start the Django Backend

```bash
# Navigate to Django project directory
cd TENFlex

# Install Python dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the Django server
python manage.py runserver
```

### 3. Start the Next.js Frontend

```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

## 📁 Project Structure

```
TENFlex/
├── src/
│   ├── utils/
│   │   ├── api.js          # API configuration and endpoints
│   │   ├── auth.js         # Authentication service
│   │   └── services.js     # Feature-specific services
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── ...            # Pages and routes
│   └── ...
├── manage.py              # Django management
├── base/                  # Django app with models, views, serializers
├── TENFlex_backend/       # Django project settings
└── requirements.txt       # Python dependencies
```

## 🔧 API Integration

### Authentication

The frontend uses token-based authentication with the Django backend:

```javascript
import { authService } from '@/utils/auth';

// Login
const response = await authService.login({
  username: 'user@example.com',
  password: 'password123'
});

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}

// Logout
authService.logout();
```

### Making API Calls

Use the provided services for different features:

```javascript
import { gigService, orderService, projectService } from '@/utils/services';

// Get all gigs
const gigs = await gigService.getAllGigs();

// Create a new gig
const newGig = await gigService.createGig({
  title: 'Web Development',
  description: 'Professional web development services',
  price: 100.00,
  // ... other fields
});

// Get user orders
const orders = await orderService.getBuyerOrders();
```

## 🔗 API Endpoints

### Authentication
- `POST /base/users/create/` - User registration
- `POST /base/api-token-auth/` - User login

### Users
- `GET /base/get_user_by_username/{username}/` - Get user by username
- `GET /base/users/{id}/` - Get user profile
- `PUT /base/users/{id}/` - Update user profile
- `GET /base/users/get-completion-percentage/` - Get profile completion

### Gigs
- `GET /base/gigs/` - Get all gigs
- `POST /base/gigs/` - Create new gig
- `GET /base/gigs/{id}/` - Get gig details
- `PUT /base/gigs/{id}/` - Update gig
- `DELETE /base/gigs/{id}/` - Delete gig
- `GET /base/user/{id}/gigs/` - Get gigs by freelancer

### Orders
- `GET /base/buyer/orders/` - Get buyer orders
- `GET /base/freelancer/orders/` - Get freelancer orders
- `GET /base/orders/{id}/` - Get order details
- `POST /base/orders/gigs/{gig_id}/book/` - Create order from gig
- `PUT /base/orders/{id}/update-status/` - Update order status
- `POST /base/orders/{id}/repeat/` - Repeat order

### Projects & Bids
- `GET /base/projects/` - Get all projects
- `POST /base/projects/create/` - Create new project
- `GET /base/projects/{id}/` - Get project details
- `POST /base/projects/{id}/bid/` - Place bid on project
- `POST /base/bids/{id}/accept/` - Accept bid
- `PUT /base/projects/{id}/update/` - Update project
- `DELETE /base/projects/{id}/delete/` - Delete project
- `POST /base/projects/{id}/reopen/` - Reopen project

### Reviews
- `GET /base/reviews/` - Get all reviews
- `POST /base/reviews/` - Create review
- `PUT /base/reviews/{id}/` - Update review
- `DELETE /base/reviews/{id}/` - Delete review

### Skills & Categories
- `GET /base/skills/` - Get all skills
- `GET /base/categories/` - Get all categories

### Gig Lists
- `GET /base/giglists/` - Get all gig lists
- `POST /base/giglists/create/` - Create gig list
- `GET /base/giglists/{id}/` - Get gig list details
- `PUT /base/giglists/{id}/update/` - Update gig list
- `DELETE /base/giglists/{id}/delete/` - Delete gig list
- `POST /base/giglists/{id}/gigs/add/` - Add gig to list
- `POST /base/giglists/{id}/gigs/remove/` - Remove gig from list

## 🔐 Authentication Flow

1. **Login**: User submits credentials → Django validates → Returns token
2. **Token Storage**: Frontend stores token in localStorage
3. **API Calls**: Frontend includes token in Authorization header
4. **Token Validation**: Django validates token for protected endpoints

## 🛠️ Development Tips

### 1. CORS Configuration

The Django backend is already configured with CORS headers for `http://localhost:3000`.

### 2. Error Handling

All API calls include proper error handling:

```javascript
try {
  const data = await gigService.getAllGigs();
  // Handle success
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error (show toast, alert, etc.)
}
```

### 3. Loading States

Use loading states for better UX:

```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};
```

### 4. Environment Variables

Always use environment variables for API URLs:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

## 🚨 Common Issues

### 1. CORS Errors
- Ensure Django server is running on `http://localhost:8000`
- Check CORS settings in `TENFlex_backend/settings.py`

### 2. Authentication Errors
- Verify token is being sent in Authorization header
- Check if token is expired
- Ensure user exists in Django database

### 3. API Endpoint Errors
- Verify endpoint URLs match Django URL patterns
- Check request method (GET, POST, PUT, DELETE)
- Ensure required fields are included in request body

## 📝 Next Steps

1. **Update Components**: Replace MongoDB calls with Django API calls
2. **Test Authentication**: Verify login/signup flow works
3. **Test CRUD Operations**: Test create, read, update, delete operations
4. **Add Error Handling**: Implement proper error handling and user feedback
5. **Optimize Performance**: Add caching and loading states

## 🔗 Useful Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/) 