import type { NextFunction, Request, Response } from "express";
import userRepository from "../../repository/userRepository.js";
import { ApiResponse } from "../../core/responseSchedule.js";

export async function isPremiumValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const uid = (req as any).uid;

  const user = await userRepository.findById(uid);

  try {
    if (user?.dataValues.isPremium) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(409).json(new ApiResponse(409, "Unauthorized", {}));
  }
}
