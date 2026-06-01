export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly isOperational: boolean;

    constructor(
        statusCode: number,
        errorCode: string,
        message: string,
        isOperational = true,
    ) {
        const normalizedStatusCode =
            typeof statusCode === 'number' ? statusCode : Number(message);
        const normalizedMessage =
            typeof statusCode === 'number' ? String(message) : statusCode;

        super(normalizedMessage);
        this.statusCode = normalizedStatusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
    export class NotFoundError extends AppError {
        constructor(message = 'Resource not found', errorCode = 'NOT_FOUND') {
          super(404, message, errorCode);
        }
      }
      
      export class BadRequestError extends AppError {
        constructor(message = 'Bad request', errorCode = 'BAD_REQUEST') {
          super(400, message, errorCode);
        }
      }
      
      export class UnauthorizedError extends AppError {
        constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
          super(401, message, errorCode);
        }
      }
      
      export class ForbiddenError extends AppError {
        constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
          super(403, message, errorCode);
        }
      }
      
      export class ConflictError extends AppError {
        constructor(message = 'Conflict', errorCode = 'CONFLICT') {
          super(409, message, errorCode);
        }
      }
      
      export class ValidationError extends AppError {
        public readonly errors: Record<string, string[]>;
      
        constructor(
          message = 'Validation failed',
          errors: Record<string, string[]> = {},
          errorCode = 'VALIDATION_ERROR'
        ) {
          super(422, message, errorCode);
          this.errors = errors;
        }
      }
      
      export class InternalError extends AppError {
        constructor(message = 'Internal server error', errorCode = 'INTERNAL_ERROR') {
          super(500, message, errorCode, false);
        }
      }
