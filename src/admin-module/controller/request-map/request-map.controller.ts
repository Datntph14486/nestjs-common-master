import { Controller, Logger } from '@nestjs/common';
import { RequestMapService } from '../../service/request-map/request-map.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';
import { RequestMapGuard } from 'src/admin-module/guard/request-map.guard';

@Controller(['/api/v1/request-map', '/api/v1/requestmap'])
export class RequestMapController extends BaseEntityController {
    private readonly log = new Logger(RequestMapController.name);

    constructor(public entityService: RequestMapService) {
        super(entityService)
    }

    override onAfterSave(): void {
        RequestMapGuard.clearCacheRequestMap()
    }

    override onAfterUpdate(): void {
        RequestMapGuard.clearCacheRequestMap()
    }

    override onAfterDelete(): void {
        RequestMapGuard.clearCacheRequestMap()
    }
}
