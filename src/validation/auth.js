import Joi from 'joi';
import { emailRegexp } from '../constants/auth.js';

export const authRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().pattern(emailRegexp).min(3).max(30).required(),
    password: Joi.string().min(3).max(20).required(),
});

export const authLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).min(3).max(30).required(),
    password: Joi.string().min(3).max(20).required(),
});

export const requestResetEmailSchema = Joi.object({
    email: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required(),
  });