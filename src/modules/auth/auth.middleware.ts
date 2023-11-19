import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import config from '../../config/config';
import ApiError from '../errors/ApiError';
import { roleRights } from '../../config/roles';
import { IUserDoc } from '../user/user.interfaces';
import jwt from 'jsonwebtoken';

// const verifyCallback =
//   (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
//   async (err: Error, user: IUserDoc, info: string) => {
//     console.log(`Error - ${err}`)
//     console.log(`Info - ${info}`)
//     if (err || info || !user) {
//       return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//     }
//     req.user = user;
//     console.log(req.user)
//     resolve();
//   };

  const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUserDoc, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params['userId'] !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      if(req.headers.authorization?.replace("Bearer", "") as string){
        let token = req?.headers?.authorization?.replace("Bearer ", "") as string;
        if(token){
           jwt.verify(token, config.jwt.secret, (err: any, decoded: any)=>{
            if(err){
              return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
            }
            resolve();
            req.user = decoded;  
            console.log(decoded)     
            if (requiredRights.length) {
              const userRights = roleRights.get(decoded.role);
              if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
              const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
              if (!hasRequiredRights && req.params['userId'] !== decoded.id) {
                return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
              }
            }
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
