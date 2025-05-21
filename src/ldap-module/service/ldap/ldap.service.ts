import { Injectable } from "@nestjs/common";
import { UserService } from "src/admin-module/service/user/user.service";
import { LdapUserDirector } from "./ldap-user-directory.service";

@Injectable()
export class LDAPService {
    readonly ldapEnable: boolean = process.env['ldap.enable'] !== 'false';

    constructor() {
        if (this.ldapEnable) UserService.regUserDirectory(new LdapUserDirector())
    }
}