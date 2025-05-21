## Custom Command
```bash
# add entity
$ node ./generate.js entity <EntityName> --src=<folder_path>

# add service
$ node ./generate.js service <EntityName> --src=<folder_path>

# add controller
$ node ./generate.js controller <EntityName> --src=<folder_path>

# add all
$ node ./generate.js all <EntityName> --src=<folder_path>

# eg
$ node ./generate.js all Transaction --src=./src/admin-module
```

## Cấu hình multi datasource
### app.module.ts:
- Lưu ý từ datasource thứ 2 cần cung cấp **name**
```
...
imports: [
    ...
    //https://docs.nestjs.com/techniques/database#multiple-databases
    TypeOrmModule.forRoot({
      ...dbDefaultOptions,
      type: 'mysql',
      host: 'qtdashboard.ddns.net',
      port: 3306,
      username: 'base-web',
      password: 'base-web@123',
      database: 'base-web',
      // entities: [],
      autoLoadEntities: true,
      synchronize: true,
      poolSize: 5,
      logger: 'simple-console',
      timezone: '+07:00',
    }),
    TypeOrmModule.forRoot({
      ...dbDefaultOptions,
      name: 'mongodb',
      type: 'mongodb',
      host: 'qtdashboard.ddns.net',
      port: 27017,
      username: 'vietstock',
      password: 'vietstock%40123',
      database: 'vietstock',
      useUnifiedTopology: true,
      timezone: '+07:00',
      autoLoadEntities: true,
    }),
...
```
### *.module.ts
- Tại các Module có sử dụng Multi Datasource
```
...
imports: [
  ...
  TypeOrmModule.forFeature([<Tên_Entity>], '<Tên_Datasource>'),
...
```
### *.service.ts
- Tại các Provider có sử dụng Repository cho Entity
```
...
constructor(@InjectRepository(<Tên_Entity>, '<Tên_Datasource>') public entityRepository: Repository<<Tên_Entity>>) {
        super(entityRepository);
    }
...
```
