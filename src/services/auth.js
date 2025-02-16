import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { UserCollection}  from "../db/models/User.js";
import { SessionCollection } from "../db/models/Session.js";
import {randomBytes} from "crypto";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/auth.js";

const createSessionData = ()=> ({
  accessToken: randomBytes(30).toString("base64"),
  refreshToken: randomBytes(30).toString("base64"),
  accessTokenValidUntil: new Date(Date.now() + accessTokenLifetime),
  refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifetime),
});

    export const registerUser = async (payload) => {

        const user = await UserCollection.findOne({ email: payload.email });
        if (user) {throw createHttpError(409, 'Email in use');
        }
        const encryptedPassword = await bcrypt.hash(payload.password, 10);
      
        return await UserCollection.create({
          ...payload,
          password: encryptedPassword,
        });
      };

    export const loginUser = async (payload) => {
        const user = await UserCollection.findOne({ email: payload.email });
        if (!user) {throw createHttpError(404, 'User not found');
        }
        const isPasswordCorrect = await bcrypt.compare(payload.password, user.password);
        if (!isPasswordCorrect) {throw createHttpError(401, 'Unauthorized');
        }

        await SessionCollection.deleteOne({userId: user._id});
        
        
        const sessionData = createSessionData(); 
        return await SessionCollection.create({
          userId: user._id,
          ...sessionData,
        });
       
      };
export const refreshToken = async (payload) => {
  const oldSession = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });

  if(!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if(Date.now() > oldSession.refreshTokenValidUntil.getTime()) {
    throw createHttpError(401, 'Refresh token expired');
  }
  await SessionCollection.deleteOne({_id: payload.sessionId});
  const sessionData = createSessionData();
  
  return SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
});
};

export const logout = async sessionId => {
  await SessionCollection.deleteOne({_id: sessionId});
};
    export const getUser = filter => UserCollection.findOne(filter);
    export const getSession = filter => SessionCollection.findOne(filter);

