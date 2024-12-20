import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { expressjwt } from 'express-jwt';
import { trainerRouter } from './controller/trainer.routes'; // Ensure this path is correct
import { userRouter } from './controller/user.routes'; // Ensure you have the user router for login/signup
import { nurseRouter } from './controller/nurse.routes';
import helmet from 'helmet';

const app = express();
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          connectSrc: ["'self'", 'https://api.ucll.be'],
      },
  })
);

// Load environment variables
dotenv.config();
const port = process.env.APP_PORT || 3000;

// JWT Middleware - Exclude login and signup from JWT verification
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET || 'default_secret',
    algorithms: ['HS256'],
  }).unless({
    path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users','/users/signup', '/status'], // Exclude /users/login, /users/signup
  })
);

// CORS configuration
app.use(cors({ origin: 'http://localhost:8080' }));

// Body Parser for JSON requests
app.use(bodyParser.json());

// Swagger setup
const swaggerOpts = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Courses API',
      version: '1.0.0',
    },
  },
  apis: ['./controller/*.routes.ts'], // Ensure user.routes.ts is included here
};


// Swagger specification
const swaggerSpec = swaggerJSDoc(swaggerOpts);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use the trainerRouter for '/trainers' routes
app.use('/trainers', trainerRouter);

// Use the userRouter for login/signup routes
app.use('/users', userRouter);

app.use('/nurses', nurseRouter);  // Mount nurseRoutes under /api/nurses


// Status endpoint
app.get('/status', (req, res) => {
  res.json({ message: 'Back-end is running...' });
});

// Start the server
app.listen(port, () => {
  console.log(`Back-end is running on port ${port}.`);
});
