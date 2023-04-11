import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";
import HttpStatusCode from "@shared/errors/HttpStatusCode";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

async function captureToken(request: Request) {
  const authHeader = request.headers.authorization;

    if(!authHeader) {
      throw new AppError("Token missing", HttpStatusCode.UNAUTHORIZED);

    }

    const [, token] = authHeader.split(" ");
    return token
}

export async function ensureAuthenticated(
  request: Request, response: Response, next: NextFunction) {
       
    try {
  
      const token = await captureToken(request);

      const {sub: user_id} = verify(
        token, 
        auth.secret_token
      ) as IPayload;

      request.user = {
        id: user_id
      }
      
      next();
      
    } catch (error) {
      throw new AppError("Invalid token!", HttpStatusCode.UNAUTHORIZED);
    }
}