import { Module } from '@nestjs/common';
import { JWTKeycloadProvider } from './service/auth-provider/jwt-keycloak.provider';

/**
 * 
 */
@Module({
    imports: [],
    providers: [JWTKeycloadProvider],
    exports: []
})
export class SSOModule { 
    constructor() {
    }
}
