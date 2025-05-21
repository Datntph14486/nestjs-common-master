import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DomainMapping } from '../../entity/domain-mapping/domain-mapping.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import * as _ from 'lodash';
import { limit } from 'src/common-module/utils/promise.utils';

@Injectable()
export class DomainMappingService extends BaseEntityService {
    private readonly log = new Logger();

    constructor(@InjectRepository(DomainMapping) public entityRepository: Repository<DomainMapping>) {
        super(entityRepository);
    }

    /**
     * Tạo 1 liên kết
     * @param {*} firstDomain 
     * @param {*} firstId 
     * @param {*} secondDomain 
     * @param {*} secondId 
     */
    join(firstDomain: string, firstId: number, secondDomain: string, secondId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({ where: { firstDomain: firstDomain, firstId: firstId, secondDomain: secondDomain, secondId: secondId } })
                .then((item: DomainMapping) => {
                    if (!item) {
                        let __item = new DomainMapping()
                        __item.firstDomain = firstDomain
                        __item.firstId = firstId
                        __item.secondDomain = secondDomain
                        __item.secondId = secondId
                        this.entityRepository.save(__item).then((item) => {
                            resolve(item)
                            return
                        }).catch(e => {
                            reject(e)
                            return
                        })
                    } else {
                        resolve(null)
                        return
                    }
                }).catch(e => {
                    reject(e)
                    return
                })
        })
    }

    /**
     * Tạo nhiều liên kết
     * @param {*} firstDomain 
     * @param {*} firstId 
     * @param {*} secondDomain 
     * @param {*} secondIds 
     */
    async joinMulti(firstDomain: string, firstId: number, secondDomain: string, secondIds: number[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let __whereClause: any = {}
            __whereClause.firstDomain = firstDomain
            __whereClause.firstId = firstId
            __whereClause.secondDomain = secondDomain
            __whereClause.secondId = In(secondIds)
            this.entityRepository.find({
                where: __whereClause,
                select: ['firstDomain', 'firstId', 'secondDomain', 'secondId']
            }).then((items) => {
                let existKeys = items.map(item => { return `${item.firstDomain}_${item.firstId}_${item.secondDomain}_${item.secondId}` })
                limit(secondIds, (secondId: any) => {
                    let key = `${firstDomain}_${firstId}_${secondDomain}_${secondId}`
                    if (!existKeys.includes(key)) {
                        return this.join(firstDomain, firstId, secondDomain, secondId)
                    }
                    return null
                }, 5).then((value) => {
                    resolve(value)
                }).catch(e => {
                    reject(e)
                })
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Tạo liên kết mới, xóa liên kết hết hiệu lực
     * @param {*} firstDomain 
     * @param {*} firstId 
     * @param {*} secondDomain 
     * @param {*} secondIds 
     */
    smartJoin(firstDomain: any, firstId: any, secondDomain: any, secondIds: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let __whereClause: any = {}
            __whereClause.firstDomain = firstDomain
            __whereClause.firstId = firstId
            __whereClause.secondDomain = secondDomain
            this.entityRepository.find({
                where: __whereClause,
                select: ['id', 'firstDomain', 'firstId', 'secondDomain', 'secondId']
            }).then(async (items: DomainMapping[]) => {
                let existKeys = items.map(item => { return `${item.firstDomain}_${item.firstId}_${item.secondDomain}_${item.secondId}` })
                //Thêm
                limit(secondIds, (secondId) => {
                    let key = `${firstDomain}_${firstId}_${secondDomain}_${secondId}`;
                    if (!existKeys.includes(key)) {
                        this.log.debug(`add ${key}...`);
                        return this.join(firstDomain, firstId, secondDomain, secondId);
                    } else {
                        return null
                    }
                }, 5).then(() => {
                    //Xóa lần lượt để lưu backup vào Recylce Bin
                    let keys = secondIds.map((secondId_1: number) => { return `${firstDomain}_${firstId}_${secondDomain}_${secondId_1}`; });
                    limit(items, (item_1) => {
                        let key_1 = `${item_1.firstDomain}_${item_1.firstId}_${item_1.secondDomain}_${item_1.secondId}`;
                        if (!keys.includes(key_1)) {
                            this.log.debug(`delete ${key_1}...`);
                            return this.entityRepository.remove(item_1)
                        } else {
                            return null
                        }
                    }, 5).then((value) => {
                        resolve(value)
                    }).catch((e) => {
                        reject(e);
                    })
                }).catch((e) => {
                    reject(e);
                });
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Xóa 1 liên kết
     * @param {*} firstDomain 
     * @param {*} firstId 
     * @param {*} secondDomain 
     * @param {*} secondId 
     */
    unJoin(firstDomain: any, firstId: any, secondDomain: any, secondId: any) {
        throw new Error('Method not implemented.');
    }

    /**
     * Xóa nhiều liên kết
     * @param {*} firstDomain 
     * @param {*} firstId 
     * @param {*} secondDomain 
     * @param {*} secondId 
     */
    unJoinMulti(firstDomain: any, firstId: any, secondDomain: any, secondId: any) {
        throw new Error('Method not implemented.');
    }
}
