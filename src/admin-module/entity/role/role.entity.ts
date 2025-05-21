import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common-module/entity/base/base.entity';

@Entity({ name: 'tbl_role' })
export class Role extends BaseEntity {
    @Index({ unique: true, })
    @Column({ nullable: false, length: 32 })
    authority: string;

    @Column()
    priority: number;

    @Column({ nullable: true })
    description: string;
}