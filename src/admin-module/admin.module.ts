import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from 'src/common-module/common.module';

import { UserController } from './controller/user/user.controller';
import { RoleController } from './controller/role/role.controller';
import { CategoryController } from './controller/category/category.controller';
import { CategoryDataController } from './controller/category-data/category-data.controller';
import { RequestMapController } from './controller/request-map/request-map.controller';
import { DomainMappingController } from './controller/domain-mapping/domain-mapping.controller';
import { RecycleBinController } from './controller/recycle-bin/recycle-bin.controller';

import { User } from './entity/user/user.entity';
import { Role } from './entity/role/role.entity';
import { Category } from './entity/category/category.entity';
import { CategoryData } from './entity/category-data/category-data.entity';
import { RequestMap } from './entity/request-map/request-map.entity';
import { DomainMapping } from './entity/domain-mapping/domain-mapping.entity';
import { RecycleBin } from './entity/recycle-bin/recycle-bin.entity';
import { Personal } from './entity/personal/personal.entity';

import { UserService } from './service/user/user.service';
import { RoleService } from './service/role/role.service';
import { CategoryService } from './service/category/category.service';
import { CategoryDataService } from './service/category-data/category-data.service';
import { RequestMapService } from './service/request-map/request-map.service';
import { DomainMappingService } from './service/domain-mapping/domain-mapping.service';
import { RecycleBinService } from './service/recycle-bin/recycle-bin.service';
import { Menu } from './entity/menu/menu.entity';
import { MenuService } from './service/menu/menu.service';

/**
 * Khai báo Middleware
 */
import { JWTParseMiddleware } from './middleware/jwt-parse.middleware';
import { AccessLogMiddleware } from './middleware/access-log.middleware';
import { MenuController } from './controller/menu/menu.controller';

/**
 * Khai báo Guard
 */
import { RequestMapGuard } from './guard/request-map.guard';
import { ValidatorUtils } from './utils/validator/validator.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Personal, Role, Category, CategoryData, RequestMap, DomainMapping, RecycleBin, Menu]),
    CommonModule
  ],
  controllers: [UserController, RoleController, CategoryController, CategoryDataController, RequestMapController, DomainMappingController, MenuController, RecycleBinController],
  providers: [UserService, RoleService, CategoryService, CategoryDataService, RequestMapService, DomainMappingService, MenuService, RecycleBinService,
    {
      provide: APP_GUARD,
      useClass: RequestMapGuard,
    },
    ValidatorUtils],
  exports: [TypeOrmModule, CategoryService, ValidatorUtils]
})
export class AdminModule implements NestModule {
  constructor() {
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLogMiddleware, JWTParseMiddleware).forRoutes('*')
  }
}
