import { RestTemplate } from "src/common-module/utils/rest-template/rest-template.utils"

export class OpenAPIAdapter {
    url: string = process.env['open-api.url'] || 'http://10.100.13.155'

    constructor() { }

    getAccountInfo(accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let restTemplate = new RestTemplate()
            restTemplate.get(`${this.url}/user/info`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-VIA': 'B',
                    'x-lang': 'en'
                }
            }).then((resp) => {
                let __data: any = resp['data']['d']
                this.accounts(accessToken).then((data: any) => {
                    __data.accountNumbers = data['d'].map((acc: any) => {
                        return acc.id
                    })
                    this.afacctnoInfor(accessToken, data['d'][0]['id']).then((data: any) => {
                        __data.idCode = data['d']['idCode']
                        resolve(__data)
                    }).catch(e => {
                        reject(e)
                    })
                }).catch(e => {
                    reject(e)
                })
            }).catch(e => {
                reject(e)
            })
        })
    }

    accounts(accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let restTemplate = new RestTemplate()

            restTemplate.get(`${this.url}/accounts`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-VIA': 'B',
                    'x-lang': 'en'
                }
            }).then((resp) => {
                resolve(resp.data)
            }).catch(e => {
                reject(e)
            })
        })
    }

    afacctnoInfor(accessToken: string, accountId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let restTemplate = new RestTemplate()

            restTemplate.get(`${this.url}/inq/accounts/${accountId}/afacctnoInfor`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-VIA': 'B',
                    'x-lang': 'en'
                }
            }).then((resp) => {
                resolve(resp.data)
            }).catch(e => {
                reject(e)
            })
        })
    }
}