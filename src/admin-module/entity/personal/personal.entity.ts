import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'tbl_personal' })
export class Personal extends BaseEntity {
    @OneToOne(() => User, (user) => user.personal)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @Column({ name: 'full_name', nullable: false })
    fullName: string;

    @Column({ name: 'short_name', nullable: true })
    shortName: string;

    @Column({ name: 'email', nullable: true })
    email: string;

    @Column({ name: 'dob', nullable: true })
    dob: Date;

    @Column({ name: 'gender', nullable: true, length: 16 })
    gender: string;
}