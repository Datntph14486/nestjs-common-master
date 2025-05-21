import { Injectable, CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserDetail } from "../../common-module/dto/user/user.dto";
import * as _ from "lodash";

/**
 * Kiểm tra role có quyền truy cập API không
 */
@Injectable()
export class RoleGuard implements CanActivate {
    private readonly log = new Logger(RoleGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return this.validateRequest(context, request, response);
    }

    validateRequest(context: ExecutionContext, request: any, response: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let userDetail: UserDetail = request['userDetail']
            /**
             * userDetail hoặc userDetail.authorities không tồn tại  thì coi như là chưa đăng nhập
             */
            if (userDetail === undefined || userDetail.authorities === undefined) {
                response.status(401).send()
                return;
            }
            resolve(this.checkRole(context, userDetail?.authorities))
        })
    }

    checkRole(context: ExecutionContext, authorities: string[]): boolean {
        const __roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!__roles) {
            return true;
        }
        for (const role of __roles) {
            if (authorities.includes(role)) {
                return true
            }
        }
        return false
    }
}