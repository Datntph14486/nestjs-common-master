import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { Category } from '../category/category.entity';

@Entity({ name: 'tbl_category_data' })
@Index(['category', 'code', 'lang'], { unique: true, })
export class CategoryData extends BaseEntity {
    @ManyToOne(() => Category, (category) => category.data)
    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    category: Category;

    @Index()
    @Column({ nullable: false, length: 32 })
    code: string;

    @Column({ nullable: false, })
    value: string;

    @Index()
    @Column({ nullable: false, length: 32 })
    lang: string;

    @Column({ nullable: true, type: 'json', })
    props: any;
}