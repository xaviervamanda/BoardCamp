import joi from "joi";


export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone must be a string with 10 or 11 numeric digits.`}).required(),
    cpf: joi.string().length(11).regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `CPF must be a string with 11 numeric digits.`}).required(),
    birthday: joi.date().iso().raw().required()
})
