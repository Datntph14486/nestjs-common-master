import { Injectable, Logger } from "@nestjs/common";
import { UserDetail } from "src/common-module/dto/user/user.dto";
import { IAuthProvider } from "src/common-module/utils/auth-provider/i-auth.provider";
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import { AuthUtils } from "src/common-module/utils/auth-provider/auth.utils";

@Injectable()
export class JWTKeycloadProvider implements IAuthProvider {
    options = {
        algorithm: process.env['sso.jwt.algorithm'] || 'RS256',
        expireTime: process.env['jwt.expire-time'] ? parseInt(process.env['jwt.expire-time']) : 3600,
        issuer: process.env['sso.jwt.issuer'] || 'xxx',
        secret: `-----BEGIN PUBLIC KEY-----\n${process.env['sso.jwt.secret']}\n-----END PUBLIC KEY-----` || 'tutq@123',
        tokenType: 'Bearer'
    }

    readonly log = new Logger(JWTKeycloadProvider.name)

    constructor() {
        AuthUtils.regProvider(this)
    }

    createAccessToken(payload: any): Promise<string> {
        throw new Error("Method not implemented.");
    }

    verifyAccessToken(accessToken: string): Promise<any> {
        let _jwtDecoded = jwt.decode(accessToken, { complete: true })
        return Promise.resolve(jwt.verify(accessToken, this.options.secret, {
            complete: true,
            algorithms: [this.options.algorithm as jwt.Algorithm]
        }))
    }

    getUserDetail(accessToken: string): Promise<UserDetail> {
        return new Promise((resolve, reject) => {
            this.verifyAccessToken(accessToken).then((claim) => {
                return resolve({
                    username: claim.payload.preferred_username,
                    authorities: claim.payload.resource_access[process.env['sso.client-id']]?.roles || [],
                    exp: claim.payload.exp,
                    iat: claim.payload.iat
                })
            }).catch(e => {
                return reject(e)
            })
        })
    }

    createResponsePayload(userDetail: UserDetail): Promise<any> {
        throw new Error("Method not implemented.");
    }

}