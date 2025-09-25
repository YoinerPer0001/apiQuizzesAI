import type { NextFunction, Request, Response } from 'express'
import { body, check, param } from 'express-validator'
import { validateResult } from '../../core/validateResult.js'

export const createQuizValidator = [
  body("title")
    .notEmpty().withMessage("Title can't be empty")
    .isLength({ max: 255 }).withMessage("Title length must be less than 255 characters")
    .isString().withMessage("Title must be a string"),

  body("language")
    .notEmpty().withMessage("Language is required")
    .isString().withMessage("Language must be a string"),

  body("is_public")
    .notEmpty().withMessage("is_public is required")
    .isBoolean().withMessage("is_public must be a boolean"),

  body("difficult")
    .notEmpty().withMessage("Difficulty is required")
    .isIn(["hard", "medium", "easy"]).withMessage("Difficulty must be one of: hard, medium, easy"),

  body("category_id")
    .notEmpty().withMessage("Category ID is required")
    .isUUID().withMessage("Category ID must be a valid UUID"),

  body("resources")
    .notEmpty().withMessage("Resources is required")
    .isIn(["handwritten", "pdf"]).withMessage("Resources must be one of: handwritten, pdf"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]
