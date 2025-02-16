import { refreshTokenLifeTime, accessTokenLifeTime } from '../constants/contactTypeList.js';
import * as authServices from '../services/auth.js';

export const registerController = async(req, res, next) =>{
const user = await authServices.registerUser(req.body);

res.status(201).json({
    status: 201, 
    message: "Successfully registered a user!",
    data: user,

  });
};

export const loginController = async(req, res, next) => {
const session = await authServices.loginUser(req.body);

res.cookie("refreshToken", session.refreshToken, {
  httpOnly: true,
  expires: new Date(Date.now() + refreshTokenLifeTime),
});

res.cookie("sessionId", session._id, {
  httpOnly: true,
  expires: new Date(Date.now() + refreshTokenLifeTime),
});

res.json({
  status: 200,
  message: 'Successfully logged in an user!',
  data: {
    accessToken: session.accessToken,
  },
});
};