import { Injectable, CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserDetail } from "../../common-module/dto/user/user.dto";
import * as _ from "lodash";
import { RequestMapService } from "../service/request-map/request-map.service";
import { RequestMap } from "../entity/request-map/request-map.entity";
import { Request, Response } from "express";
import * as globToRegExp from 'glob-to-regexp'

/**
 * Kiểm tra role có quyền truy cập API không
 */
@Injectable()
export class RequestMapGuard implements CanActivate {
    /**
     * Có sử dụng Guard hay không
     */
    static active: boolean = true;

    static readonly log = new Logger(RequestMapGuard.name);

    public static requestMapService: RequestMapService;
    public static requestMaps: RequestMap[] = [];
    public static requestMapRegex: any = {};

    constructor(requestMapService: RequestMapService) {
        RequestMapGuard.requestMapService = requestMapService
        RequestMapGuard.clearCacheRequestMap()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return RequestMapGuard.active === false || this.validateRequest(request, response);
    }

    validateRequest(request: Request, response: Response): Promise<any> {
        return new Promise((resolve, reject) => {
            let userDetail: UserDetail = request['userDetail']

            let __requestMaps: RequestMap[] = RequestMapGuard.requestMaps.filter((requestMap) => {
                let regex: RegExp = RequestMapGuard.requestMapRegex[requestMap.uuid]
                let match: boolean = regex.test(request.url) && (_.isEmpty(requestMap.httpMethod) || (requestMap.httpMethod === request.method))
                let configAttributes = requestMap.configAttributes.split(',')
                match &&= configAttributes.includes('permitAll') || (userDetail.authorities && (configAttributes.includes('isAuthenticated()') || _.difference(userDetail.authorities, configAttributes).length < userDetail.authorities.length))
                return match
            })

            let rs: boolean = __requestMaps.length > 0 || (__requestMaps.length === RequestMapGuard.requestMaps.length)

            RequestMapGuard.log.debug(`[${request.method}] ${request.url} --[${__requestMaps.map((requestMap) => { return requestMap.id })}]--> ${rs}`)
            resolve(rs)
        })
    }

    static clearCacheRequestMap(): Promise<any> {
        RequestMapGuard.log.log('clearCacheRequestMap...')
        return new Promise((resolve, reject) => {
            RequestMapGuard.requestMapService.loadDataTable<RequestMap>({
                filters: {
                    active: { matchMode: 'equals', value: true }
                },
                rows: 10000
            }).then((res) => {
                RequestMapGuard.requestMaps = res[0];
                RequestMapGuard.requestMaps.forEach((requestMap: RequestMap) => {
                    let regex: RegExp = globToRegExp(requestMap.url.trim())
                    RequestMapGuard.requestMapRegex[requestMap.uuid] = regex
                })
                RequestMapGuard.log.log('clearCacheRequestMap done')
                resolve(RequestMapGuard.requestMaps)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}