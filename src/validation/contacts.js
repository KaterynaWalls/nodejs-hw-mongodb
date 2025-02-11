import Joi from 'joi';
import {contactTypeList} from '../constants/contactTypeList.js';

export const createContactSchema = Joi.object({
   name: Joi.string().min(3).max(20).required(),
   phoneNumber: Joi.string().min(10).max(20).required(),
   email: Joi.string().email().required(),
   isFavourite: Joi.boolean().default(false), 
   contactType: Joi.string().min(3).max(20).valid(...contactTypeList).required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(10).max(20),
    email: Joi.string().email(),
    isFavourite: Joi.boolean().default(false), 
    contactType: Joi.string().min(3).max(20).valid(...contactTypeList),
 });