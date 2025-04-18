# Toilet Conflict Application
- Summary  
Toilet Conflict is a humorous web application that tracks and visualizes marital tensions arising from bathroom usage habits. Built as a first-person experience from a husband's perspective, the application tracks daily toilet usage and the resulting "complaints" from the wife based on frequency.  

- The core mechanics are simple but entertaining:  

When the husband uses the toilet 3 times in a day, the wife begins complaining  
Each additional toilet use triggers one more complaint  
When complaints reach 3, a "conflict" erupts, visualized by a nuclear explosion GIF  
This application demonstrates a full-stack   implementation with React frontend and Express/MongoDB backend, featuring user authentication, state management, and data persistence.  


# Prerequisites  

Node.js (v16+)  
MongoDB instance (local or Atlas)  

### Frontend
```sh
cd frontend
npm install react-dom react-router-dom axios jwt-decode
npm run dev
```

### Backend
```sh
cd backend
npm install
node server.js
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
REACT_APP_API_URL=http://localhost:3003
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
Semantic HTML structure for screen reader   
## compatibility
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
- Tracked per user
- Reset at midnight
- Stored in the toiletSessions MongoDB collection

## Usage Patterns:
- Historical data available for up to 7 days
- Tracks number of toilet visits per day
- Tracks resulting complaint levels

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

# Data Tracking Implementation

- Our application implements minimal but purposeful tracking of user behavior to enhance the user experience and support application improvement. We track toilet usage patterns and session frequency to provide personalized insights while respecting privacy. All tracked data is anonymized before analysis, with personally identifiable information separated from behavior metrics. Users can access and delete their data through the profile settings, and we maintain transparency by clearly outlining what data is collected during signup. Our tracking approach balances analytical needs with strong privacy protection, storing only what's necessary for the application's core functionality.

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

# Security Threats and Vulnerabilities

- This application, like many web applications, faces several security challenges. Cross-Site Scripting (XSS) attacks could allow attackers to inject malicious scripts into pages viewed by other users, potentially stealing session tokens or personal information. SQL/NoSQL Injection attacks might enable unauthorized database access if input sanitization is inadequate. 

- To mitigate XSS vulnerabilities specifically, we've implemented multiple layers of protection. First, all user inputs are sanitized before storage using input validation libraries that strip potentially dangerous HTML/JavaScript tags and attributes. Second, we employ Content Security Policy (CSP) headers that restrict which scripts can execute in the browser, preventing injected scripts from running. Third, we use React's built-in JSX escaping for dynamic content rendering, ensuring user-generated content is treated as text rather than executable code. Finally, we implement HTTPOnly cookies for authentication tokens, making them inaccessible to client-side JavaScript and therefore protected from theft via XSS attacks. These measures collectively create robust protection against one of the most common web application vulnerabilities.