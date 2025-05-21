import { Entity, Column, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Terms, TermsState } from '../terms/terms.entity';

@Entity({ name: 'tbl_terms_hist' })
export class TermsHist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'longtext' })
    content: string

    @ManyToOne(() => Terms, (terms) => terms.history)
    @JoinColumn({ name: 'terms_id', referencedColumnName: 'id' })
    terms: Terms;

    @Index()
    @Column()
    version: number = 1;

    @Column({ name: 'created_at' })
    createdAt: Date = new Date()

    @Column()
    state: TermsState = TermsState.EDITING

    @Index()
    @Column()
    action: string

    @Column()
    maintaining: boolean = true

    @Column({ nullable: true, length: 32 })
    assignee: string

    @Column({ name: 'updated_by', nullable: true, length: 32 })
    updated_by: string

}