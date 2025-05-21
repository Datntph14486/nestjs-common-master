import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_domain_mapping' })
export class DomainMapping {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false, name: 'first_domain' })
    firstDomain: string;

    @Index()
    @Column({ nullable: false, name: 'first_id' })
    firstId: number;

    @Index()
    @Column({ nullable: false, name: 'second_domain' })
    secondDomain: string;

    @Index()
    @Column({ nullable: false, name: 'second_id' })
    secondId: number;
}