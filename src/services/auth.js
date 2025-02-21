import createHttpError from "http-errors";

import bcrypt from "bcrypt";
import { UserCollection}  from "../db/models/User.js";
import { SessionCollection } from "../db/models/Session.js";
import {randomBytes} from "crypto";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/auth.js";
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';
import {TEMPLATES_DIR} from '../constants/path.js';
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


    export const requestResetToken = async (email) => {
      const user = await UserCollection.findOne({ email });
      if (!user) {
        throw createHttpError(404, 'User not found!');
      }
      const resetToken = jwt.sign(
        {
          sub: user._id,
          email,
        },
        getEnvVar('JWT_SECRET'),
        {
          expiresIn: '15m',
        }
      );
      
     

      const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html'
      );
      try {
        await fs.access(resetPasswordTemplatePath); // Перевіряє, чи існує файл
      } catch (error) {
        console.error("Template file not found:", resetPasswordTemplatePath);
        throw createHttpError(500, 'Email template file is missing.');
      }
      const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
      ).toString();
    
      const template = handlebars.compile(templateSource);

     

      const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`
      });

      try {
        await sendEmail({
          from: getEnvVar('SMTP_FROM'),
          to: email,
          subject: 'Reset your password',
          html,
        });
      } catch (error) {
        console.error("Email sending error:", error.message);
        throw createHttpError(
          500,  `Failed to send the email, please try again later. Error: ${error.message}`,
        );
      }
    };
    
    export const resetPassword = async (payload) => {
      let entries;
    
      try {
        entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
      } catch (error) {
        if (error instanceof Error)
          throw createHttpError(401, `Token is expired or invalid.`);
        throw error;
      }
    // throw createHttpError(401,  `Token is expired or invalid.`); 
    //   }    
    //   if (!entries?.email || !entries?.sub) {
    //     throw createHttpError(401,  'Token is expired or invalid.');
    //   }
      const user = await UserCollection.findOne({
        email: entries.email,
        _id: entries.sub,
      });
    
      if (!user) {
        throw createHttpError(404, 'User not found');
      }
    
      const encryptedPassword = await bcrypt.hash(payload.password, 10);
    
      await UserCollection.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
      );
    
      await SessionCollection.deleteOne({ userId: user._id });
    };