import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, Index, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { TermsHist } from '../terms-hist/terms-hist.entity';

@Entity({ name: 'tbl_terms' })
export class Terms extends BaseEntity {
    @Column()
    version: number = 1;

    @Column({ name: 'program_code' })
    programCode: string

    @Column({ unique: true })
    name: string

    @Column({ type: 'longtext' })
    content: string

    @Column()
    maintaining: boolean = true

    /**
     * User đang xử lý điều khoản
     */
    @Column({ nullable: true, length: 32 })
    assignee: string

    @Index()
    @Column()
    state: TermsState = TermsState.EDITING

    @Column({ type: 'json' })
    options: any = {}

    @OneToMany(() => TermsHist, (termHist) => termHist.terms)
    history: TermsHist[];

    @BeforeUpdate()
    beforeUpdate() {
        // this.version += 1
    }
}

export enum TermsState {
    EDITING = 100,
    COMPLETED = 101,
    WAITING_FOR_APPROVAL = 200,
    APPROVED = 300,
    REJECTED = 301
}