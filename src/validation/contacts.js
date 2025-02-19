import Joi from 'joi';
import {contactTypeList} from '../constants/contactTypeList.js';



export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must have at least 3 characters',
    'string.max': 'Name cannot exceed 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in international format (+XXXXXXXXXXX)',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Invalid email format',
  }),
  isFavourite: Joi.boolean().optional().messages({
    'boolean.base': 'isFavourite must be a boolean',
  }),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .required()
    .messages({
      'any.only': `contactType must be one of: ${contactTypeList.join(', ')}`,
      'any.required': 'contactType is required',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.min': 'Name must have at least 3 characters',
    'string.max': 'Name cannot exceed 20 characters',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .messages({
      'string.pattern.base': 'Phone number must be in international format (+XXXXXXXXXXX)',
    }),
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be a boolean',
  }),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .messages({
      'any.only': `contactType must be one of: ${contactTypeList.join(', ')}`,
    }),
}).or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType')
.messages({
  'object.missing': 'At least one field must be updated',
});



// export const createContactSchema = Joi.object({
//    name: Joi.string().min(3).max(20).required(),
//    phoneNumber: Joi.string().min(10).max(20).required(),
//    email: Joi.string().email().required(),
//    isFavourite: Joi.boolean().default(false), 
//    contactType: Joi.string().min(3).max(20).valid(...contactTypeList).required(),
// });

// export const updateContactSchema = Joi.object({
//     name: Joi.string().min(3).max(20),
//     phoneNumber: Joi.string().min(10).max(20),
//     email: Joi.string().email(),
//     isFavourite: Joi.boolean().default(false), 
//     contactType: Joi.string().min(3).max(20).valid(...contactTypeList),
//  });