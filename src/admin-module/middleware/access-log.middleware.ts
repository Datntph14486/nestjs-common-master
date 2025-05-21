
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
    private readonly log = new Logger(AccessLogMiddleware.name);

    constructor() { }

    use(request: Request, res: Response, next: NextFunction) {
        this.log.debug(`<-- [${request['socket']['remoteAddress']}][${request['method']}] ${request['originalUrl']} | ${JSON.stringify(request['body'])}`);
        next();
    }
}