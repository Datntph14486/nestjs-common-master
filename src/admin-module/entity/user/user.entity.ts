import { hashSync } from 'bcrypt';
import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, Index, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common-module/entity/base/base.entity';
import { Personal } from '../personal/personal.entity';
import { Role } from '../role/role.entity';

@Entity({ name: 'tbl_user' })
export class User extends BaseEntity {
    @Index({ unique: true })
    @Column({ nullable: false, })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, default: true })
    enabled: boolean = true;

    @Column({ nullable: false, default: false, name: 'account_expired' })
    accountExpired: boolean = false;

    @Column({ nullable: false, default: false, name: 'account_locked' })
    accountLocked: boolean = false;

    @Column({ nullable: false, default: false, name: 'password_expired' })
    passwordExpired: boolean = false;

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'tbl_user_role',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[]

    @OneToOne(() => Personal, (personal) => personal.user)
    personal: Personal;

    @BeforeInsert()
    beforeInsert() {
        this.password = `{bcrypt}${hashSync(this.password, 10)}`;
    }

    @BeforeUpdate()
    beforeUpdate() {
        if (this.password) {
            if (!this.password.startsWith('{bcrypt}')) {
                this.password = `{bcrypt}${hashSync(this.password, 10)}`
            } else {
                this.password = null
            }
        }
    }

    @BeforeRemove()
    beforeRemove() {
    }
}