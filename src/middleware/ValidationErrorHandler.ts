import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { ValidationError } from "class-validator";
import { Request, Response } from "express";

@Middleware({ type: "after" })
export class ValidationErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: any,
    req: Request,
    res: Response,
    next: (err?: any) => any
  ): any {
    if (
      Array.isArray(error?.errors) &&
      error.errors.every((e) => e instanceof ValidationError)
    ) {
      const formatted = error.errors.map((e) => ({
        field: e.property,
        errors: Object.values(e.constraints || {}),
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatted,
      });
    }

    // fallback to default error
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred",
    });
  }
}
