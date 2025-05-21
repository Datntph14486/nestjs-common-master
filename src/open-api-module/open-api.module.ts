import { Module } from '@nestjs/common';
import { OpenAPIGuard } from './guard/open-api.guard';
import { CommonModule } from 'src/common-module/common.module';

/**
 * 
 */
@Module({
    imports: [CommonModule],
    controllers: [],
    providers: [OpenAPIGuard],
    exports: [OpenAPIGuard]
})
export class OpenAPIModule {
    constructor() {
    }
}
