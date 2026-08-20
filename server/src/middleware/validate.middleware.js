import ApiError from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details
        .map((detail) => detail.message)
        .join(", ");

      return next(new ApiError(400, message));
    }

    req.body = value;

    next();
  };
};

export default validate;