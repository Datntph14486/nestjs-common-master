import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/admin-module/entity/role/role.entity';
import { DataSource, Repository } from 'typeorm';
import { BaseEntityService } from '../../../common-module/service/base-entity/base-entity.service';
import { DomainMappingService } from '../domain-mapping/domain-mapping.service';
import { GeneralResponse } from 'src/common-module/dto/general-response.dto';
import { DomainMapping } from 'src/admin-module/entity/domain-mapping/domain-mapping.entity';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import * as _ from 'lodash';

@Injectable()
export class RoleService extends BaseEntityService {
    static readonly MIN_ROLE_PRIORITY: number = 99999999;

    constructor(@InjectDataSource() private dataSource: DataSource,
        @InjectRepository(Role) public entityRepository: Repository<Role>, private domainMappingService: DomainMappingService) {
        super(entityRepository)
    }

    /**
     * Lấy danh sách role theo Priority của user
     * @param params 
     */
    listByPriority(params: { userDetail: UserDetail }): Promise<Role[]> {
        return new Promise((resolve, reject) => {
            this.entityRepository.find().then((items: Role[]) => {
                let __maxPriority = RoleService.MIN_ROLE_PRIORITY
                items.forEach((item: Role) => {
                    if ((params.userDetail.authorities || []).includes(item.authority)) {
                        if (item.priority < __maxPriority) __maxPriority = item.priority
                    }
                })
                return resolve(items.filter((role: Role) => { return role.priority >= __maxPriority }))
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Lấy danh sách menu Id mà role có quyền truy cập
     * @param id 
     * @returns 
     */
    menuIds(id: number): Promise<GeneralResponse> {
        return new Promise((resolve, reject) => {
            let generalResponse = new GeneralResponse()
            this.domainMappingService.loadDataTable({
                filters: {
                    firstDomain: { matchMode: 'equals', value: 'role' },
                    firstId: { matchMode: 'equals', value: id },
                },
                rows: 1000
            }).then((data: any[]) => {
                generalResponse.value = data[0].map((domainMapping: DomainMapping) => {
                    return domainMapping.secondId;
                });
                resolve(generalResponse)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Cập nhật danh sách menu Id mà role có quyền truy cập
     * @param id 
     * @param menuIds 
     * @returns 
     */
    updateMenu(id: number, menuIds: number[]): Promise<GeneralResponse> {
        return new Promise((resolve, reject) => {
            let generalResponse = new GeneralResponse()
            this.domainMappingService.smartJoin('role', id, 'menu', menuIds).then((rs) => {
                generalResponse.value = rs;
                resolve(generalResponse)
            }).catch(e => {
                reject(e)
            })
        })
    }



    /**
     * So sánh priority của 2 user
     * @param firstUsername 
     * @param secondUsername 
     * @returns 
     */
    compareUserPriorityByUsername(firstUsername: string, secondUsername: string): Promise<{ firstUserPriority: number, secondUserPriority: number, result: number }> {
        return new Promise((resolve, reject) => {
            let sqlCmd: string = `select tu.username, min(tr.priority) as maxPriority
                                from tbl_user tu, tbl_role tr, tbl_user_role tur
                                where tu.id = tur.user_id 
                                and tur.role_id = tr.id
                                and tu.username in (?)
                                group by tu.username`
            this.dataSource.query(sqlCmd, [[firstUsername, secondUsername]]).then((values: any[]) => {
                let __firstUserPriority = values.find((item: any) => { return item.username === firstUsername }).maxPriority
                let __secondUserPriority = values.find((item: any) => { return item.username === secondUsername }).maxPriority
                resolve({
                    firstUserPriority: __firstUserPriority,
                    secondUserPriority: __secondUserPriority,
                    result: __firstUserPriority - __secondUserPriority
                })
            }).catch(e => {
                reject(e)
            })
        })
    }

    async getUserMaxPriorityByUsername(username: string): Promise<number> {
        if (_.isEmpty(username)) {
            return RoleService.MIN_ROLE_PRIORITY
        }

        let sqlCmd: string = `select tu.username, min(tr.priority) as maxPriority
                            from tbl_user tu, tbl_role tr, tbl_user_role tur
                            where tu.id = tur.user_id 
                            and tur.role_id = tr.id
                            and tu.username = ?
                            group by tu.username
                            limit 1`

        let value: any[] = await this.dataSource.query(sqlCmd, [username])
        return value.at(0)?.maxPriority || RoleService.MIN_ROLE_PRIORITY
    }

    async getUserMaxPriorityByRoleIds(roleIds: any[]): Promise<number> {
        if (_.isEmpty(roleIds)) {
            return RoleService.MIN_ROLE_PRIORITY
        }

        let sqlCmd: string = `select min(tr.priority) as maxPriority
                                from tbl_role tr
                                where tr.id in (?)`
        let value: any[] = await this.dataSource.query(sqlCmd, [roleIds])
        return value.at(0)?.maxPriority || RoleService.MIN_ROLE_PRIORITY
    }
}
