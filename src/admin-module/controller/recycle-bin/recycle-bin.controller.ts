import { Controller } from '@nestjs/common';
import { RecycleBinService } from '../../service/recycle-bin/recycle-bin.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller('/api/v1/recycle-bin')
export class RecycleBinController extends BaseEntityController {
    constructor(public entityService: RecycleBinService) {
        super(entityService)
    }
}
