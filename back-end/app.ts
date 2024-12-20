import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { expressjwt } from 'express-jwt';
import { trainerRouter } from './controller/trainer.routes'; 
import { userRouter } from './controller/user.routes'; 
import { nurseRouter } from './controller/nurse.routes';

const app = express();


dotenv.config();
const port = process.env.APP_PORT || 3000;


app.use(
  expressjwt({
    secret: process.env.JWT_SECRET || 'default_secret',
    algorithms: ['HS256'],
  }).unless({
    path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users','/users/signup', '/status'], 
  })
);


app.use(cors({ origin: 'http://localhost:8080' }));


app.use(bodyParser.json());


const swaggerOpts = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Courses API',
      version: '1.0.0',
    },
  },
  apis: ['./controller/*.routes.ts'], 
};



const swaggerSpec = swaggerJSDoc(swaggerOpts);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/trainers', trainerRouter);


app.use('/users', userRouter);

app.use('/nurses', nurseRouter); 



app.get('/status', (req, res) => {
  res.json({ message: 'Back-end is running...' });
});


app.listen(port, () => {
  console.log(`Back-end is running on port ${port}.`);
});
