import { CacheModule, Module } from '@nestjs/common';
import { JwtProvider } from './utils/auth-provider/jwt.provider';
import { RestTemplate } from './utils/rest-template/rest-template.utils';
import * as moment from 'moment';
import { MemCacheAdapter } from './utils/cache/mem-cache-adapter';
import { NodeModulesUtils } from './utils/node-modules.utils';

@Module({
    imports: [CacheModule.register()],
    providers: [
        JwtProvider, RestTemplate, MemCacheAdapter,
    ],
    exports: [JwtProvider, RestTemplate, MemCacheAdapter]
})
export class CommonModule {
    constructor() {
        NodeModulesUtils.loadVersions()

        Date.prototype.toJSON = function () {
            return moment(this).format();
        }
    }
}
