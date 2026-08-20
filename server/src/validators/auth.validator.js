import Joi from "joi";

const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .required(),

  role: Joi.string()
    .valid("student", "faculty", "admin")
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(1)
    .max(128)
    .required(),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),
});

const verifyEmailSchema = Joi.object({
  verificationToken: Joi.string()
    .hex()
    .length(64)
    .required(),
});

const resetPasswordSchema = Joi.object({
  resetToken: Joi.string()
    .hex()
    .length(64)
    .required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .required(),

  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match.",
    }),
});

export {
  registerSchema,
  loginSchema,
  emailSchema,
  verifyEmailSchema,
  resetPasswordSchema,
};