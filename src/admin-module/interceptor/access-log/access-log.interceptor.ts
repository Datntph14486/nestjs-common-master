import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { IncomingMessage } from "http";
import { Observable } from "rxjs";
import { InterceptorUtils } from "src/app-module/utils/interceptor/interceptor.utils";

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
    private readonly log = new Logger(AccessLogInterceptor.name);

    constructor() {
        InterceptorUtils.regHandler(this)
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: IncomingMessage = context.switchToHttp().getRequest();
        return next.handle()
    }
}