import jwt from 'jsonwebtoken';
import { Role } from '../types';


const generateJwtToken = (user: { email: string, role: string }) => {
  const secretKey = process.env.JWT_SECRET || 'your-secret-key';
  const token = jwt.sign(
    { email: user.email, role: user.role },
    secretKey,
    { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'pokecare' } 
  );
  return token;
};


export { generateJwtToken };
