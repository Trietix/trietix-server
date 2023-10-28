import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import config from '../../config/config';
import ApiError from '../errors/ApiError';
import { roleRights } from '../../config/roles';
import { IUserDoc } from '../user/user.interfaces';
import jwt from 'jsonwebtoken';

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUserDoc, info: string) => {
    console.log(`Error - ${err}`)
    console.log(`Info - ${info}`)
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      // config.jwt.secret
      if(req.headers.authorization?.replace("Bearer", "") as string){
        let token = req?.headers?.authorization?.replace("Bearer ", "") as string;
        if(token){
           jwt.verify(token, config.jwt.secret, (err: any, decoded: any)=>{
            if(err){
              return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
            }
            resolve();
            req.user = decoded;
            next();
          })
        } else {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
      } else {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      }
    })
      .catch((err) => next(err));

export default authMiddleware;
