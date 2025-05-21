import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { Observable } from 'rxjs';
import { UserDetail } from "src/common-module/dto/user/user.dto";
import * as _ from "lodash";
import { MemCacheAdapter } from "src/common-module/utils/cache/mem-cache-adapter";
import { OpenAPIProvider } from "../utils/auth-provider/open-api.provider";

@Injectable()
export class OpenAPIGuard implements CanActivate {
    static tokenMap: any = {}

    readonly tokenTTL: number = parseInt(process.env['open-api.cache.token.ttl'] || '10000');

    constructor(private cacheManager: MemCacheAdapter) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return this.validateRequest(request, response);
    }

    validateRequest(request: any, response: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let authorization: string = request.headers['authorization']

            if (_.isEmpty(authorization)) {
                response.status(401).send()
                return
            }

            let accessToken = authorization.substring(7)

            let __key = `openapi_${accessToken}`

            this.cacheManager.wrap<UserDetail>(__key, () => {
                let openAPIProvider: OpenAPIProvider = new OpenAPIProvider()
                return openAPIProvider.getUserDetail(accessToken)
            }, this.tokenTTL).then((userDetail: UserDetail) => {
                request['userDetail'] = userDetail
                resolve(userDetail.username !== 'anonymousUser')
            })
        })
    }
}