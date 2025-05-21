import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from 'src/common-module/common.module';
import { AdminModule } from 'src/admin-module/admin.module';

import { Terms } from './entity/terms/terms.entity';
import { TermsController } from './controller/terms/terms.controller';
import { TermsService } from './service/terms/terms.service';
import { TermsHist } from './entity/terms-hist/terms-hist.entity';
import { TermsCust } from './entity/terms-cust/terms-cust.entity';
import { TermsMBAController } from './controller/terms/terms.mba.controller';
import { OpenAPIModule } from 'src/open-api-module/open-api.module';
import { TermsMBAService } from './service/terms/terms.mba.service';
import { TermsCustController } from './controller/terms-cust/terms-cust.controller';
import { TermsCustService } from './service/terms-cust/terms-cust.service';
import { TermsHistController } from './controller/terms-hist/term-hist.controller';
import { TermsHistService } from './service/terms-hist/term-hist.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Terms, TermsHist, TermsCust]),
        CommonModule,
        AdminModule,
        OpenAPIModule,
        ScheduleModule.forRoot()
    ],
    controllers: [TermsController, TermsMBAController, TermsCustController, TermsHistController],
    providers: [TermsService, TermsMBAService, TermsCustService, TermsHistService],
    exports: [TypeOrmModule]
})
export class MainModule { }
