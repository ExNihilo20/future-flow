import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLoggerService implements LoggerService {
    private readonly logger = new Logger('FutureFlow');

    log(message: any, ...optionalParams: any[]) {
        this.logger.log(message,...optionalParams);
    }

    error(message: any, ...optionalParams: any[]) {
        this.logger.log(message, ...optionalParams);
    }

    warn(message: any, ...optionalParams: any[]) {
        this.logger.log(message, ...optionalParams);
    }

    debug(message: any, ...optionalParams: any[]) {
        this.logger.log(message, ...optionalParams);
    }

    verbose(message: any, ...optionalParams: any[]) {
        this.logger.log(message, ...optionalParams);
    }
}
