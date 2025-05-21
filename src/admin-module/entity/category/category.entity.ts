import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { CategoryData } from '../category-data/category-data.entity';

@Entity({ name: 'tbl_category' })
export class Category extends BaseEntity {
    @Index({ unique: true, })
    @Column({ nullable: false, length: 32 })
    code: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => CategoryData, (categoryData) => categoryData.category)
    data: CategoryData[];
}