import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

// Importing our custom route handlers
import shortlistRoutes from './routes/shortlist.js';

/**
 * CONFIGURATION
 * Loads environment variables from a .env file into process.env.
 * This keeps sensitive data like API keys and Port numbers out of the source
 * code.
 */
dotenv.config();

const app = express();
const PORT =
    process.env.PORT || 5000;  // Fallback to 3000 if PORT is not defined

/**
 * GLOBAL MIDDLEWARE
 */
// CORS (Cross-Origin Resource Sharing): Allows your frontend (e.g., React or
// Vue) to communicate with this backend even if they are on different domains.
app.use(cors());

// JSON Parser: Automatically parses incoming requests with JSON payloads,
// making the data available under 'req.body'.
app.use(express.json());

/**
 * ROUTES
 * We delegate all requests starting with '/shortlist' to our shortlistRoutes
 * module. This keeps the main file clean and organized as the project grows.
 */
app.use('/shortlist', shortlistRoutes);

/**
 * SERVER INITIALIZATION
 * Starts the server and begins listening for incoming network requests.
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});