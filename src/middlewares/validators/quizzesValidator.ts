import type { NextFunction, Request, Response } from 'express'
import { body, check, param } from 'express-validator'
import { validateResult } from '../../core/validateResult.js'

export const createQuizValidator = [
  body("title")
    .notEmpty().withMessage("Title can't be empty")
    .isLength({ max: 255 }).withMessage("Title length must be less than 255 characters")
    .isString().withMessage("Title must be a string"),

  body("language_id")
    .notEmpty().withMessage("language_id ID is required")
    .isUUID().withMessage("language_id ID must be a valid UUID"),

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

  // Validar que data sea un array
  body("data")
    .isArray({ min: 1 }).withMessage("Data must be a non-empty array"),

  // Validar el contenido de cada pregunta
  body("data.*.question.text")
    .isString().withMessage("Question text must be a string"),

  body("data.*.question.time_limit")
    .isInt({ min: 1 }).withMessage("time_limit must be an integer greater than 0"),

  body("data.*.question.type")
    .notEmpty().withMessage("Question type is required")
    .isIn(["mopt", "tf", "both"]).withMessage("Type must be one of: mopt, tf, both"),

  // Validar que answers sea un array
  body("data.*.question.answers")
    .isArray({ min: 2 }).withMessage("Answers must be an array with at least 2 options"),

  body("data.*.question.answers.*.text")
    .notEmpty().withMessage("Answer text can't be empty")
    .isString().withMessage("Answer text must be a string"),

  body("data.*.question.answers.*.is_correct")
    .isBoolean().withMessage("is_correct must be a boolean"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const geTAllQuizzesValidator = [
  param("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Total must be an integer greater than 0"),
  param("limit")
    .optional()
    .isInt({ min: 1 }).withMessage("TotalPages must be an integer greater than 0"),
  param("category")
    .optional()
    .isString().withMessage("Category must be a string")
    .isUUID().withMessage("Category must be a valid UUID"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]
