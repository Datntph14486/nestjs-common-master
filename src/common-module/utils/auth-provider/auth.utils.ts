import { Logger } from "@nestjs/common"
import { UserDetail } from "src/common-module/dto/user/user.dto"
import { IAuthProvider } from "./i-auth.provider"

export class AuthUtils {
    static readonly log = new Logger(AuthUtils.name)

    static authProviders: IAuthProvider[] = []

    public static regProvider(provider: IAuthProvider) {
        AuthUtils.authProviders.push(provider)
    }

    static getUserDetail(accessToken: string): Promise<UserDetail> {
        return new Promise((resolve) => {
            Promise.allSettled(this.authProviders.map((provider: IAuthProvider) => {
                return provider.getUserDetail(accessToken)
            })).then((values: any[]) => {
                let value: UserDetail = values.find((item: any) => {
                    return item.status === 'fulfilled'
                })
                if (value) {
                    resolve(value['value'])
                } else {
                    resolve({
                        username: 'anonymousUser',
                    })
                }
            }).catch(err => {
                this.log.error(err.message)
                resolve({
                    username: 'anonymousUser',
                })
            })
        })
    }
}