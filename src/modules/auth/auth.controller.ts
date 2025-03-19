import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { sendMail } from '../utils/sendMail';

type Respons = {
  status: "success" | "fail";
  statusCode: number,
  data: null | {},
  message: string,
  error: null | any
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
    if(req.body.bank){
      sendMail(req.body.email, "Welcome to Trietix", {}, "organizer/welcome.hbs")
    } else{
      sendMail(req.body.email, "Welcome to Trietix", {}, "user/welcome.handlebars")
    }
      res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

export const forgotPassword = catchAsync(async(req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email)
  res.status(httpStatus.FOUND).send({
    status: "success",
    statusCode: httpStatus.FOUND,
    data: null,
    message: "Please check your mail for a reset link!",
    error: null
  })
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  let { user, tokens } = await authService.resetPassword(req.body.resetToken, req.body.password);
  res.status(200).send({
    status: "success",
    statusCode: 200,
    data: {
      user,
      tokens
    },
    message: "Password reset successfully!",
    error: null,
  })
})