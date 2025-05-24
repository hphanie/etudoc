const Joi = require('joi');

const loginSchema = Joi.object(
    {
        email: Joi.string().required().email(),
        motDePasse: Joi.string().min(6).required()
    }
);

const registerSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  motDePasse: Joi.string().min(6).required(),
  role: Joi.string().valid('etudiant', 'admin').default('etudiant'),
});

const forgetPassword = Joi.object({
    email: Joi.string().required().email()
});

const resetPassword = Joi.object({
    motDePasse: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('motDePasse'),
});


module.exports = {
    loginSchema,
    registerSchema,
    forgetPassword,
    resetPassword
}

