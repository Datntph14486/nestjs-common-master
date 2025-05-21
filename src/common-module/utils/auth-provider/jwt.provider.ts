import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import { UserDetail } from 'src/common-module/dto/user/user.dto'
import { IAuthProvider } from './i-auth.provider'

@Injectable()
export class JwtProvider implements IAuthProvider {
    options = {
        algorithm: process.env['jwt.algorithm'] || 'HS256',
        expireTime: process.env['jwt.expire-time'] ? parseInt(process.env['jwt.expire-time']) : 3600,
        issuer: process.env['jwt.issuer'] || 'xxx',
        secret: process.env['jwt.secret'] || 'tutq@123',
        tokenType: 'Bearer'
    }

    createAccessToken(payload: any): Promise<string> {
        let accessToken = jwt.sign(payload, this.options.secret, {
            algorithm: this.options.algorithm as jwt.Algorithm
        })

        return Promise.resolve(accessToken)
    }

    createResponsePayload(userDetail: UserDetail): Promise<any> {
        const currentTime = Math.round(new Date().getTime() / 1000)

        return new Promise(resolve => {
            this.createAccessToken({
                sub: userDetail.username,
                roles: userDetail.authorities,
                iss: this.options.issuer,
                iat: currentTime,
                exp: currentTime + this.options.expireTime
            }).then((accessToken) => {
                resolve({
                    username: userDetail.username,
                    roles: userDetail.authorities,
                    token_type: this.options.tokenType,
                    expires_in: this.options.expireTime,
                    access_token: accessToken,
                })
            })
        })
    }

    verifyAccessToken(accessToken: string): Promise<any> {
        return Promise.resolve(jwt.verify(accessToken, this.options.secret, {
            algorithms: [this.options.algorithm as jwt.Algorithm]
        }))
    }

    getUserDetail(accessToken: string): Promise<UserDetail> {
        return new Promise((resolve) => {
            this.verifyAccessToken(accessToken).then((claim) => {
                return resolve({
                    username: claim.sub.toString(),
                    authorities: claim['roles'],
                    exp: claim['exp'],
                    iat: claim['iat']
                })
            })
        })
    }
}