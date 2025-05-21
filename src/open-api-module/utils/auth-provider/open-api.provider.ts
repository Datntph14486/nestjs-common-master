import { Logger } from "@nestjs/common";
import { UserDetail } from "src/common-module/dto/user/user.dto";
import { IAuthProvider } from "src/common-module/utils/auth-provider/i-auth.provider";
import { OpenAPIAdapter } from "src/open-api-module/service/open-api/open-api.adapter";

export class OpenAPIProvider implements IAuthProvider {
    readonly log = new Logger(OpenAPIProvider.name)

    constructor() {
    }

    createAccessToken(payload: any): Promise<string> {
        throw new Error("Method not implemented.");
    }

    verifyAccessToken(accessToken: string): Promise<UserDetail> {
        let userDetail: UserDetail
        return new Promise((resolve, reject) => {
            let openApiAdapter = new OpenAPIAdapter()
            openApiAdapter.getAccountInfo(accessToken).then((value) => {
                userDetail = new UserDetail()
                userDetail.username = value['username']
                userDetail.payload = value
                userDetail.src = 'OpenAPIProvider'
                resolve(userDetail)
            }).catch(e => {
                userDetail = new UserDetail()
                userDetail.username = 'anonymousUser'
                userDetail.src = 'OpenAPIProvider'
                resolve(userDetail)
            })
        })
    }

    getUserDetail(accessToken: string): Promise<UserDetail> {
        return this.verifyAccessToken(accessToken)
    }

    createResponsePayload(userDetail: UserDetail): Promise<any> {
        throw new Error("Method not implemented.");
    }

}