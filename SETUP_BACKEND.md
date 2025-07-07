# Django Backend Setup Guide

Since Python wasn't available in the current environment, follow these steps to set up the Django backend:

## Prerequisites

1. **Install Python** (if not already installed):
   - Download from [python.org](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH" during installation

2. **Verify Python installation**:
   ```bash
   python --version
   # or
   py --version
   ```

## Setup Steps

### 1. Navigate to Project Directory
```bash
cd TENFlex
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations
```bash
python manage.py migrate
```

### 4. Create a Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 5. Start the Django Server
```bash
python manage.py runserver
```

The Django backend will be available at: `http://localhost:8000`

## Verify Backend is Running

1. Open your browser and go to: `http://localhost:8000/admin/`
2. You should see the Django admin interface
3. The API endpoints will be available at: `http://localhost:8000/base/`

## Test API Endpoints

You can test the API endpoints using curl or a tool like Postman:

```bash
# Test skills endpoint
curl http://localhost:8000/base/skills/

# Test categories endpoint  
curl http://localhost:8000/base/categories/

# Test gigs endpoint
curl http://localhost:8000/base/gigs/
```

## Frontend Integration

Once the backend is running:

1. The frontend is already configured to connect to `http://localhost:8000/base`
2. Visit `http://localhost:3000` to see the frontend
3. Go to `http://localhost:3000/test-integration` to run integration tests
4. Try signing up and logging in to test authentication

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:
```bash
python manage.py runserver 8001
```
Then update `.env.local` to use port 8001.

### Database Issues
If you get database errors:
```bash
python manage.py makemigrations
python manage.py migrate
```

### CORS Issues
The Django backend is already configured with CORS for `http://localhost:3000`. If you change the frontend port, update `TENFlex_backend/settings.py`.

## API Documentation

All available endpoints are documented in `BACKEND_INTEGRATION.md`.

## Next Steps

1. Start the Django backend using the steps above
2. Test the integration at `http://localhost:3000/test-integration`
3. Try creating a user account and logging in
4. Test creating gigs, projects, and other features 