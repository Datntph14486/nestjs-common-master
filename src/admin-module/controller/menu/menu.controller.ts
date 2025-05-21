import { Controller } from '@nestjs/common';
import { MenuService } from '../../service/menu/menu.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller('/api/v1/menu')
export class MenuController extends BaseEntityController {
    constructor(public entityService: MenuService) {
        super(entityService)
    }
}
