import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_request_map' })
export class RequestMap extends BaseEntity {
    @Column({ nullable: false, name: 'config_attributes' })
    configAttributes: ConfigAttributeEnum | string;

    @Column({ nullable: true, name: 'http_method', length: 16 })
    httpMethod: string;

    @Column({ nullable: false, })
    url: string;

    @Column({ nullable: true })
    active: boolean = true;
}

export enum ConfigAttributeEnum {
    denyAll = 'denyAll',
    isAuthenticated = 'isAuthenticated()',
    permitAll = 'permitAll',
}