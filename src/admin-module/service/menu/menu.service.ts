import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../../entity/menu/menu.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class MenuService extends BaseEntityService {
    constructor(@InjectRepository(Menu) public entityRepository: Repository<Menu>) {
        super(entityRepository);
    }
}
