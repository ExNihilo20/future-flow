import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston';

import { getLogDirectory } from './log-path.util';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: WinstonLogger;

  constructor() {
    const logDirectory = getLogDirectory();

    fs.mkdirSync(logDirectory, { recursive: true });

    const logFormat = format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.printf(({ timestamp, level, message, context, stack }) => {
        const loggerContext = context ? ` [${context}]` : '';
        const errorStack = stack ? `\n${stack}` : '';

        return `${timestamp} ${level.toUpperCase()}${loggerContext} ${message}${errorStack}`;
      }),
    );

    this.logger = createLogger({
      level: process.env.LOG_LEVEL ?? 'info',
      format: logFormat,
      transports: [
        new transports.Console(),

        new transports.File({
          filename: path.join(logDirectory, 'futureflow.log'),
          maxsize: 5 * 1024 * 1024,
          maxFiles: 5,
        }),

        new transports.File({
          filename: path.join(logDirectory, 'error.log'),
          level: 'error',
          maxsize: 5 * 1024 * 1024,
          maxFiles: 5,
        }),
      ],
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(String(message), {
      context: this.getContext(optionalParams),
    });
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(String(message), {
      context: this.getContext(optionalParams),
      stack: this.getStack(optionalParams),
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(String(message), {
      context: this.getContext(optionalParams),
    });
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(String(message), {
      context: this.getContext(optionalParams),
    });
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(String(message), {
      context: this.getContext(optionalParams),
    });
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.logger.error(String(message), {
      context: this.getContext(optionalParams),
      stack: this.getStack(optionalParams),
    });
  }

  private getContext(optionalParams: any[]): string | undefined {
    const context = optionalParams.find(
      (param) => typeof param === 'string',
    );

    return context;
  }

  private getStack(optionalParams: any[]): string | undefined {
    const stack = optionalParams.find(
      (param) =>
        typeof param === 'string' &&
        (param.includes('\n') || param.includes('Error')),
    );

    return stack;
  }
}