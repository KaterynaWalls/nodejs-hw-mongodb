
import * as authServices from '../services/auth.js';


const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
  });

  res.cookie("sessionId", session.id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async(req, res) =>{
const user = await authServices.registerUser(req.body);

res.status(201).json({
    status: 201, 
    message: "Successfully registered a user!",
    data: user,

  });
};

export const loginController = async(req, res, next) => {
  const session = await authServices.loginUser(req.body);
  
  setupSession(res, session);
  
res.json({
  status: 200,
  message: 'Successfully logged in an user!',
  data: {
    accessToken: session.accessToken,
  },
});
};

export const refreshTokenController = async(req, res) => {
const {refreshToken, sessionId} = req.cookies;

const session = await authServices.refreshToken({refreshToken, sessionId});

setupSession(res, session);
res.json({
  status: 200,
  message: "Successfully refresh session",
  data: {
      accessToken: session.accessToken,
  }
});
};

export const logoutController = async(req, res)=> {
  if(req.cookies.sessionId) {
      await authServices.logout(req.cookies.sessionId);
  }

  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {

 await authServices.requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};
export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);

  res.json({
    status: 200,
    message:  'Password has been successfully reset.',
    data: {},
  });
};