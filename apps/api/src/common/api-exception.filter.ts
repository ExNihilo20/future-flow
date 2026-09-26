import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { AppLoggerService } from './logging/app-logger.service';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'success' in exceptionResponse
      ) {
        response.status(status).json(exceptionResponse);
        return;
      }

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : ((exceptionResponse as { message?: string | string[] }).message ??
            exception.message);

      response.status(status).json({
        success: false,
        message: Array.isArray(message) ? message.join(', ') : message,
        errors: Array.isArray(message) ? message : [],
      });
      return;
    }

    if (exception instanceof Error) {
      this.logger.error(
        exception.message,
        exception.stack,
        ApiExceptionFilter.name,
      );
    } else {
      this.logger.error(
        `Unknown exception: ${String(exception)}`,
        ApiExceptionFilter.name,
      );
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      errors: [],
    });
  }
}