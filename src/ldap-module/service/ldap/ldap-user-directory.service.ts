import { Logger } from '@nestjs/common';
import * as ldap from 'ldapjs'
import { IUserDirectory } from 'src/admin-module/service/user/i-user-directory';

export class LdapUserDirector implements IUserDirectory {
    private readonly log = new Logger(LdapUserDirector.name);

    url: string = process.env['ldap.url'];
    baseDn: string = process.env['ldap.base-dn'];
    bindDn: string = process.env['ldap.bind-dn'];
    username: string = process.env['ldap.username'];
    password: string = process.env['ldap.password'];
    ssl: boolean = process.env['ldap.ssl'] === 'true'
    connectTimeout = process.env['ldap.connect-timeout'] ? parseInt(process.env['ldap.connect-timeout']) : 5000

    __connect(): Promise<ldap.Client> {
        return new Promise((resolve, reject) => {
            const client = ldap.createClient({
                url: [this.url],
                connectTimeout: this.connectTimeout
            })

            client.on('connect', (value) => {
                resolve(client)
            })
            client.on('connectError', (err) => {
                this.log.error(`connectError: ${err.message}`)
                reject(err)
            })
            client.on('error', (err) => {
                this.log.error(`error: ${err.message}`)
                reject(err)
            })
            client.on('destroy', () => {
                // this.log.log(`${client} destroyed`)
            })
        })
    }

    /**
     * Lấy thông tin user từ LDAP
     * @param username 
     * @returns 
     */
    search(username: string): Promise<any[]> {
        let opts: ldap.SearchOptions = {
            filter: `(&(objectCategory=Person)(sAMAccountName=${username}))`,
            scope: 'sub'
        };
        return new Promise((resolve, reject) => {
            this.__connect().then((client) => {
                client.bind(this.username, this.password, (err, res) => {
                    if (err) {
                        reject(err)
                        client.destroy()
                        return
                    }

                    client.search(this.baseDn, opts, (err, res) => {
                        var __entries: any[] = [];
                        res.on('searchEntry', (entry) => {
                            // this.log.log('entry: ' + entry.object['dn']);
                            __entries.push(entry.object)
                        });
                        res.on('searchReference', (referral) => {
                            // this.log.log('referral: ' + referral.uris.join());
                        });
                        res.on('error', (err) => {
                            this.log.error(`error: ${err.message}`)
                            resolve(__entries)
                            client.destroy()
                        });
                        res.on('end', (result) => {
                            // this.log.log('status: ' + result.status);
                            resolve(__entries)
                            client.destroy()
                        });
                    })
                })
            })
        })
    }

    /**
     * Kiểm tra thông tin xác thực user
     * @param username 
     * @param password 
     * @returns 
     */
    check(username: string, password: string): Promise<boolean> {
        let opts: ldap.SearchOptions = {
            filter: `(&(objectCategory=Person)(sAMAccountName=${username}))`,
            scope: 'sub'
        };
        return new Promise((resolve, reject) => {
            this.__connect().then((client) => {
                client.bind(this.username, this.password, (err, res) => {
                    if (err) {
                        reject(err)
                        client.destroy()
                        return
                    }

                    client.search(this.baseDn, opts, (err, res) => {
                        var __entries: any[] = [];
                        res.on('searchEntry', (entry) => {
                            this.log.log(entry.object['dn']);
                            __entries.push(entry.object)
                        });
                        res.on('searchReference', (referral) => {
                            // this.log.log('referral: ' + referral.uris.join());
                        });
                        res.on('error', (err) => {
                            this.log.error(`error: ${err.message}`)
                        });
                        res.on('end', (result) => {
                            // this.log.log('status: ' + result.status);
                            if (__entries.length == 0) {
                                resolve(false)
                                client.destroy()
                                return
                            }

                            client.bind(__entries[0]['dn'], password, (err, res) => {
                                if (err) {
                                    // console.error(err.message)
                                    resolve(false)
                                    return
                                }
                                resolve(true)
                                client.destroy()
                            })
                        });
                    })
                })
            })
        })
    }
}