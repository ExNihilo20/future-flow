import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston';
import { ConfigService } from '@nestjs/config';
import { getLogDirectory } from './log-path.util';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: WinstonLogger;

  constructor(private readonly configService: ConfigService) {
    const logLevel = this.configService.get<string>('LOG_LEVEL', 'info');
    const logMaxSize = this.configService.get<number>(
      'LOG_MAX_SIZE',
      5 * 1024 * 1024,
    );
    const logMaxFiles = this.configService.get<number>('LOG_MAX_FILES', 5);
    const configuredLogDirectory = this.configService.get<string>('LOG_DIR');
    const logDirectory = getLogDirectory(configuredLogDirectory);

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
      level: logLevel,
      format: logFormat,
      transports: [
        new transports.Console(),

        new transports.File({
          filename: path.join(logDirectory, 'futureflow.log'),
          maxsize: logMaxSize,
          maxFiles: logMaxFiles,
        }),

        new transports.File({
          filename: path.join(logDirectory, 'error.log'),
          level: 'error',
          maxsize: logMaxSize,
          maxFiles: logMaxFiles,
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