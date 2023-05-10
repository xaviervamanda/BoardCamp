import joi from "joi";

export const gameSchema = joi.object({
    name: joi.string().required(),
    image:joi.string().required(),
    stockTotal: joi.number().integer().positive().greater(0).required(),
    pricePerDay: joi.number().positive().greater(0).required()
})