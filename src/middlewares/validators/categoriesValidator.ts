import type { NextFunction, Request, Response } from 'express'
import { body, check, param } from 'express-validator'
import { validateResult } from '../../core/validateResult.js'

export const createValidator = [
    check('text')
        .exists().withMessage("text is required")
        .not().isEmpty().withMessage('text cannot be empty')
        .isString().withMessage('text must be a string')
        .isLength({ max: 100 }).withMessage('max length is 100'),

    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]

export const updateValidator = [
    body().custom((value, { req }) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error("At least one parameter must be provided");
        }
        return true;
    }),

    check("text")
        .optional()
        .notEmpty().withMessage("text cannot be empty")
        .isString().withMessage("text must be a string")
        .isLength({ max: 100 }).withMessage("max length is 100"),

    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }   
];


