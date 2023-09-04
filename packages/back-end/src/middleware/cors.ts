import { Request, Response, NextFunction } from 'express';

export default function CorsConfig(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = ['http://localhost:3000']; // Replace with your frontend's URL

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}