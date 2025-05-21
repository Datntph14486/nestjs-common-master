import { Module } from '@nestjs/common';
import { CommonModule } from './common-module/common.module';
import { AdminModule } from './admin-module/admin.module';
import { MainModule } from './main-module/main.module';
import { ConfigModule } from '@nestjs/config';
import { LdapModule } from './ldap-module/ldap.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger-module/logger.module';
import { ConfigUtils } from './app-module/utils/config.utils';
import { SSOModule } from './sso-module/sso.module';

const dbDefaultOptions: any = {}

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvVars: true,
      validate: (config: Record<string, any>) => { return ConfigUtils.validate(config) }
    }),
    //https://docs.nestjs.com/techniques/database#multiple-databases
    TypeOrmModule.forRoot({
      ...dbDefaultOptions,
      type: 'mysql',
      host: process.env['data-source.host'],
      port: process.env['data-source.port'] ? parseInt(process.env['data-source.port']) : 3306,
      username: process.env['data-source.username'],
      password: process.env['data-source.password'],
      database: process.env['data-source.database'],
      // entities: [],
      autoLoadEntities: true,
      synchronize: process.env['data-source.synchronize'] === 'true',
      poolSize: process.env['data-source.pool-size'] ? parseInt(process.env['data-source.pool-size']) : 5,
      logging: ['error'],
      logger: 'simple-console',
      timezone: '+07:00',
    }),
    CommonModule,
    LoggerModule,
    AdminModule,
    LdapModule,
    SSOModule,
    MainModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule {
}
