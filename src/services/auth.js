import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {UserCollection}  from "../db/models/User.js";
import { SessionCollection } from "../db/models/Session.js";
import {randomBytes} from "crypto";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/contactTypeList.js";



    export const registerUser = async (payload) => {
        const user = await UserCollection.findOne({ email: payload.email });
        if (user) throw createHttpError(409, 'Email in use');
        
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

        const accessToken = randomBytes(30).toString("base64");
        const refreshToken = randomBytes(30).toString("base64");

        return SessionCollection.create({
          userId: user._id,
          accessToken,
          refreshToken,
          accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
          refreshTokenValidUntil: new Date(Date.now() + 
          refreshTokenLifeTime),
        });
       
      };

      export const getUser = filter => UserCollection.findOne(filter);
    export const getSession = filter => SessionCollection.findOne(filter);

