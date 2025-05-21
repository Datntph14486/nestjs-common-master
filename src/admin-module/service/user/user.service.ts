import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/admin-module/entity/user/user.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import { JwtProvider } from 'src/common-module/utils/auth-provider/jwt.provider';
import { compareSync } from 'bcrypt';
import { Role } from 'src/admin-module/entity/role/role.entity';
import { IUserDirectory } from './i-user-directory';
import { plainToInstance } from 'class-transformer';
import * as _ from 'lodash';
import { Personal } from 'src/admin-module/entity/personal/personal.entity';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { Menu } from 'src/admin-module/entity/menu/menu.entity';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService extends BaseEntityService {
    private readonly log = new Logger(UserService.name);

    static otherUserDirectories: IUserDirectory[] = [];

    constructor(@InjectDataSource() private dataSource: DataSource,
        @InjectRepository(User) public entityRepository: Repository<User>,
        @InjectRepository(Personal) public personalRepository: Repository<Personal>,
        private roleService: RoleService,
        private jwtProvider: JwtProvider) {
        super(entityRepository);
    }

    public static regUserDirectory(userDirectory: IUserDirectory) {
        UserService.otherUserDirectories.push(userDirectory)
    }

    get(id: any): Promise<any> {
        return this.entityRepository.findOne({ where: { id: id }, relations: { roles: true, personal: true } })
    }

    saveWithoutCheckUser(item: any): Promise<any> {
        let __item = plainToInstance(User, item)
        Object.keys(item).forEach((key) => {
            __item[key] = item[key]
        })
        return new Promise((resolve, reject) => {
            this.entityRepository.save(__item).then((user: User) => {
                if (!_.isEmpty(__item.personal)) {
                    let __personal = plainToInstance(Personal, __item.personal)
                    __personal.user = user
                    this.personalRepository.save(__personal).then((personal: Personal) => {
                        user.personal = personal;
                        resolve(user)
                    }).catch(e => {
                        reject(e)
                    });
                }
                resolve(user)
            }).catch(e => {
                reject(e)
            });
        })
    }

    override save(item: any, params?: { userDetail?: UserDetail }): Promise<User> {
        let __item = plainToInstance(User, item)
        Object.keys(item).forEach((key) => {
            __item[key] = item[key]
        })
        return new Promise((resolve, reject) => {
            /**
             * Kiểm tra user có quyền tạo mới không
             */
            Promise.allSettled([
                this.roleService.getUserMaxPriorityByUsername(params?.userDetail?.username),
                this.roleService.getUserMaxPriorityByRoleIds((item.roles || []).map((role: Role) => { return role.id }))
            ]).then((result: any[]) => {
                if (result.filter((item: any) => { return item.status !== 'fulfilled' }).length > 0) {
                    reject(new Error('Có lỗi'))
                    return
                }

                if (result[0].value > result[1].value) {
                    reject(new Error('User không đủ quyền'))
                    return
                }

                this.entityRepository.save(__item).then((user: User) => {
                    if (!_.isEmpty(__item.personal)) {
                        let __personal = plainToInstance(Personal, __item.personal)
                        __personal.user = user
                        this.personalRepository.save(__personal).then((personal: Personal) => {
                            user.personal = personal;
                            resolve(user)
                        }).catch(e => {
                            reject(e)
                        });
                    }
                    resolve(user)
                }).catch(e => {
                    reject(e)
                });
            })
        })
    }

    /**
     * Cập nhật user mà không check quyền của user call service
     * @param id 
     * @param item 
     * @param params 
     * @returns 
     */
    updateWithoutCheckUser(id: any, item: any, params?: { userDetail?: UserDetail }): Promise<User> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({ where: { id: id }, relations: { personal: true } }).then((__item: User) => {
                if (!__item) {
                    resolve(null)
                    return
                }

                let personal: any = {}
                _.assign(personal, __item.personal)
                _.assign(personal, item.personal)

                _.assign(__item, item)
                delete __item.personal
                __item.roles = []

                if (_.isEmpty(__item.password)) delete __item.password

                this.entityRepository.save(__item).then((user: User) => {
                    let __personal = plainToInstance(Personal, personal)
                    __personal.user = user
                    this.personalRepository.save(__personal).then((personal: Personal) => {
                        __item.roles = item.roles
                        this.entityRepository.save(__item).then((user: User) => {
                            resolve(user)
                        }).catch((e) => {
                            reject(e)
                        })
                    }).catch(e => {
                        reject(e)
                    });
                }).catch((e) => {
                    reject(e)
                })
            })
        })
    }

    override update(id: any, item: any, params?: { userDetail?: UserDetail }): Promise<User> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({ where: { id: id }, relations: { personal: true } }).then((__item: User) => {
                if (!__item) {
                    resolve(null)
                    return
                }

                /**
                 * Kiểm tra user có quyền update không
                 */
                Promise.allSettled([
                    this.roleService.compareUserPriorityByUsername(params.userDetail.username, __item.username),
                    this.roleService.getUserMaxPriorityByRoleIds((item.roles || []).map((role: Role) => { return role.id }))
                ]).then((result: any[]) => {
                    if (result.filter((item: any) => { return item.status !== 'fulfilled' }).length > 0) {
                        reject(new Error('Có lỗi'))
                        return
                    }

                    if (result[0].value['result'] > 0 || result[0].value['firstUserPriority'] > result[1].value) {
                        reject(new Error('User không đủ quyền'))
                        return
                    }

                    let personal: any = {}
                    _.assign(personal, __item.personal)
                    _.assign(personal, item.personal)

                    _.assign(__item, item)
                    delete __item.personal
                    __item.roles = []

                    if (_.isEmpty(__item.password)) delete __item.password

                    this.entityRepository.save(__item).then((user: User) => {
                        let __personal = plainToInstance(Personal, personal)
                        __personal.user = user
                        this.personalRepository.save(__personal).then((personal: Personal) => {
                            __item.roles = item.roles
                            this.entityRepository.save(__item).then((user: User) => {
                                resolve(user)
                            }).catch((e) => {
                                reject(e)
                            })
                        }).catch(e => {
                            reject(e)
                        });
                    }).catch((e) => {
                        reject(e)
                    })
                })
            }).catch((e) => {
                reject(e)
            })
        })
    }

    override delete(id: any, params?: { userDetail?: UserDetail }): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    personal: true
                }
            }).then(item => {
                if (!item) {
                    resolve(null)
                    return
                }

                /**
                 * Kiểm tra user có quyền delete không
                 */
                Promise.allSettled([
                    this.roleService.compareUserPriorityByUsername(params.userDetail.username, item.username)
                ]).then((result: any[]) => {
                    if (result.filter((item: any) => { return item.status !== 'fulfilled' }).length > 0) {
                        reject(new Error('Có lỗi'))
                        return
                    }

                    if (result[0].value['result'] > 0) {
                        reject(new Error('User không đủ quyền'))
                        return
                    }

                    this.personalRepository.remove((item.personal)).then(() => {
                        this.entityRepository.remove(item).then((item) => {
                            resolve(item)
                        }).catch(e => {
                            reject(e)
                        })
                    }).catch(e => {
                        reject(e)
                    })
                });
            }).catch(e => {
                reject(e)
            })
        })
    }

    deleteWithoutCheckUser(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    personal: true
                }
            }).then(item => {
                if (!item) {
                    resolve(null)
                    return
                }

                this.personalRepository.remove((item.personal)).then(() => {
                    this.entityRepository.remove(item).then((item) => {
                        resolve(item)
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

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({
                where: { username: username, deleted: false },
                relations: { roles: true }
            }).then(async (item: User) => {
                if (!item || !item.enabled || item.accountExpired || item.accountLocked || item.passwordExpired) {
                    resolve(null)
                    return
                }

                let match: boolean = compareSync(password, item.password.substring('{bcrypt}'.length, item.password.length))
                for (let idx = 0; idx < UserService.otherUserDirectories.length && match === false; idx++) {
                    let userDirectory: IUserDirectory = UserService.otherUserDirectories[idx]
                    try {
                        match ||= await userDirectory.check(username, password)
                    } catch (e) {
                        this.log.error(e)
                    }
                }
                if (!match) {
                    resolve(null)
                    return
                }

                let userDetail = {
                    username: item.username,
                    authorities: item.roles.map((item: Role) => { return item.authority })
                }

                resolve(this.jwtProvider.createResponsePayload(userDetail))
            })
        })
    }

    /**
     * Trả thông tin user theo username
     * @param username 
     * @returns 
     */
    findByUsername(username: string, params?: { relations?: Record<string, any> }): Promise<User> {
        return this.entityRepository.findOne({ where: { username: username }, relations: params?.relations })
    }

    /**
     * Lấy danh sách menu khả dụng
     * @param userDetail 
     */
    menu(userDetail: UserDetail): Promise<Menu[]> {
        return new Promise((resolve, reject) => {
            let sqlCmd = `select tm.id, tm.code, tm.name, tm.hide, tm.href, tm.icon, tm.ord, tm.parent_id as parentId, tm.active
                        from tbl_user tu
                        left join tbl_user_role tur on tu.id = tur.user_id
                        left join tbl_domain_mapping tdm on tdm.first_id = tur.role_id and tdm.first_domain = 'role'
                        left join tbl_menu tm on tm.id = tdm.second_id and tdm.second_domain = 'menu'
                        where tu.username = ? and tm.id is not null
                        order by tm.ord asc`
            this.dataSource.query(sqlCmd, [userDetail.username]).then((values: any[]) => {
                values.forEach((item: any) => {
                    item.hide = item.hide === 1
                })
                resolve(values)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Cập nhật thông tin user
     * @param username 
     * @param data 
     * @returns 
     */
    updateProfile(username: string, item: any): Promise<User> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({ where: { username: username }, relations: { personal: true } }).then((__item: any) => {
                if (!__item) {
                    reject(new Error('User không tồn tại'))
                    return
                }

                let match: boolean = compareSync(item['oldPassword'], __item.password.substring('{bcrypt}'.length, __item.password.length))
                if (!match) {
                    reject(new Error('Sai mật khẩu'))
                    return
                }

                let personal: any = {}
                _.assign(personal, __item.personal)
                _.assign(personal, item.personal)
                _.assign(__item, item)
                delete __item.personal
                delete __item.roles

                if (!_.isEmpty(__item.newPassword)) __item.password = __item.newPassword

                this.entityRepository.save(__item).then((user: User) => {
                    let __personal = plainToInstance(Personal, personal)
                    __personal.user = user
                    this.personalRepository.save(__personal).then(() => {
                        resolve(user)
                    }).catch(e => {
                        reject(e)
                    });
                }).catch((e) => {
                    reject(e)
                })
            }).catch((e) => {
                reject(e)
            })
        })
    }
}
