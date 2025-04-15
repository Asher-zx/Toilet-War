
# Toilet Conflict Application
- Summary
Toilet Conflict is a humorous web application that tracks and visualizes marital tensions arising from bathroom usage habits. Built as a first-person experience from a husband's perspective, the application tracks daily toilet usage and the resulting "complaints" from the wife based on frequency.

- The core mechanics are simple but entertaining:

When the husband uses the toilet 3 times in a day, the wife begins complaining
Each additional toilet use triggers one more complaint
When complaints reach 3, a "conflict" erupts, visualized by a nuclear explosion GIF
This application demonstrates a full-stack implementation with React frontend and Express/MongoDB backend, featuring user authentication, state management, and data persistence.


# Prerequisites

Node.js (v16+)
MongoDB instance (local or Atlas)
AWS S3 bucket (for image storage)

### Frontend
```sh
cd frontend
npm install
npm start
```

### Backend
```sh
cd backend
npm install
npm start
```

### Start the servers:
```
//Start backend server (from backend directory)
node server.js

//Start frontend development server (from frontend directory)
npm run dev
```


## Environment Variables

Create a `.env` file in `frontend` and `backend`:

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:3001
```

Backend `.env`:
```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=conflict_check
MONGO_URI=mongodb://localhost:27017/conflict_logs
```
# Accessibility (A11y) and SEO
## Accessibility Features
High contrast UI design with clear visual feedback
Semantic HTML structure for screen reader compatibility
Keyboard navigation support for all interactive elements
Status updates use both visual cues and text
## SEO Considerations
Clear, descriptive page titles and meta descriptions
Semantic HTML structure for better search engine indexing
Mobile-responsive design for better search rankings
Fast-loading through optimized assets

# Data Tracking
The application tracks the following metrics:

## Daily Toilet Usage:
Tracked per user
Reset at midnight
Stored in the toiletSessions MongoDB collection

## Usage Patterns:
Historical data available for up to 7 days
Tracks number of toilet visits per day
Tracks resulting complaint levels

## Schema:
```
{
  "userId": "string",
  "date": "Date",
  "toiletUses": "number",
  "complaints": "number",
  "conflict": "boolean"
}
```

# Security Measures

## Authentication
### JWT-based authentication system
Tokens expire after 1 hour for enhanced security
All API endpoints except login/registration are protected

### Data Protection
User passwords are hashed using bcrypt before storage
MongoDB connection secured via TLS
Environment variables used for sensitive credentials

### API Security
CORS enabled to restrict API access to authorized origins
Input validation on all endpoints
Error handling that doesn't expose sensitive information