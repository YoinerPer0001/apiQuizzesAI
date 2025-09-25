import type { NextFunction, Request, Response } from 'express'
import { body, check, param } from 'express-validator'
import { validateResult } from '../../core/validateResult.js'


export const createLangValidator = [
  body("name")
    .exists().withMessage("The 'name' field is required.")
    .isString().withMessage("The 'name' field must be a string.")
    .isLength({ max: 100 }).withMessage("The 'name' field cannot exceed 100 characters.")
    .notEmpty().withMessage("The 'name' field cannot be empty."),
    body("nativeName")
    .exists().withMessage("The 'nativeName' field is required.")
    .isString().withMessage("The 'nativeName' field must be a string.")
    .isLength({ max: 100 }).withMessage("The 'nativeName' field cannot exceed 100 characters.")
    .notEmpty().withMessage("The 'nativeName' field cannot be empty."),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];