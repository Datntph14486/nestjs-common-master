import { Module } from '@nestjs/common';
import { LDAPService } from './service/ldap/ldap.service';

/**
 * 
 */
@Module({
    imports: [],
    providers: [LDAPService]
})
export class LdapModule { }
