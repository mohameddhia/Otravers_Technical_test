const dotenv = require('dotenv').config();

const allowedOrigins = [
    process.env.CLIENT_URL,
//   'https://your-frontend-domain.com', // Add your trusted frontend domain
//   'https://another-trusted-domain.com' // Add other trusted domains if necessary
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Restrict allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization','Accept'], // Allow only specific headers
  credentials: true // Allow cookies to be sent along with the requests
};

module.exports = corsOptions;