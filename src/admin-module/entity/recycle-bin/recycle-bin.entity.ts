import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_recycle_bin' })
export class RecycleBin extends BaseEntity {
    @Index()
    @Column({ nullable: false, name: 'src_id' })
    srcId: number;

    @Index()
    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    data: string;
}