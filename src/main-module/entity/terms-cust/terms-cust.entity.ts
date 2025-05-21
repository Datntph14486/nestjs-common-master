import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { Terms } from '../terms/terms.entity';
import { CryptoHandler } from 'src/common-module/utils/crypto/crypto-handler';

@Entity({ name: 'tbl_terms_cust' })
@Index(["terms", "termsVersion", "custodyCd"], { unique: true })
export class TermsCust extends BaseEntity {
    @ManyToOne(() => Terms)
    @JoinColumn({ name: 'terms_id', referencedColumnName: 'id' })
    terms: Terms;

    @Column({ name: 'terms_version' })
    termsVersion: number

    @Column({ name: 'custody_cd', length: 32 })
    custodyCd: string

    @Column({ name: 'subscribe_notif' })
    subscribeNotif: boolean = true

    @Column({ nullable: true })
    sign: string = ''

    @BeforeInsert()
    async beforeInsert() {
        let handler: CryptoHandler = new CryptoHandler()
        this.sign = await handler.encrypt([this.uuid, this.terms.id, this.termsVersion, this.custodyCd].join('|'), { algorithm: 'md5' })
    }

    @BeforeUpdate()
    async beforeUpdate() {
        let handler: CryptoHandler = new CryptoHandler()
        this.sign = await handler.encrypt([this.uuid, this.terms.id, this.termsVersion, this.custodyCd].join('|'), { algorithm: 'md5' })
    }
}
