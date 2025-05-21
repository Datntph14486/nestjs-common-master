import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_menu' })
export class Menu extends BaseEntity {
    @Column({ length: 32, nullable: false })
    code: string;

    @Column({ nullable: true })
    hide: boolean;

    @Column({ length: 64 })
    icon: string;

    @Column({ default: true, nullable: false })
    active: boolean = true;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true, default: 0 })
    ord: number = 0;

    @Column({ name: 'parent_id', nullable: true, type: 'bigint' })
    parentId: number;

    @Column({ nullable: true })
    href: string;
}