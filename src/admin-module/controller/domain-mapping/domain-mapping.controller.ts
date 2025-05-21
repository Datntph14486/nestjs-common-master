import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { DomainMappingService } from '../../service/domain-mapping/domain-mapping.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';
import { Response } from 'express';
import { DomainMappingJoinDto, DomainMappingJoinMultiDto } from 'src/common-module/dto/domain-mapping/domain-mapping.dto';

@Controller('/api/v1/domain-mapping')
export class DomainMappingController extends BaseEntityController {
    private readonly log = new Logger();

    constructor(public entityService: DomainMappingService) {
        super(entityService)
    }

    @Post('/join')
    async join(@Body() body: DomainMappingJoinDto, @Res() res: Response): Promise<any> {
        return this.entityService.join(body.firstDomain, body.firstId, body.secondDomain, body.secondId).then((value) => {
            if (value) {
                res.json(value)
            } else {
                res.send()
            }
        })
    }

    @Post('/join-multi')
    async joinMulti(@Body() body: DomainMappingJoinMultiDto, @Res() res: Response): Promise<any> {
        return this.entityService.joinMulti(body.firstDomain, body.firstId, body.secondDomain, body.secondIds).then((value) => {
            if (value) {
                res.json(value)
            } else {
                res.send()
            }
        })
    }

    @Post('/smart-join')
    async smartJoin(@Body() body: DomainMappingJoinMultiDto, @Res() res: Response): Promise<any> {
        return this.entityService.smartJoin(body.firstDomain, body.firstId, body.secondDomain, body.secondIds).then((value) => {
            if (value) {
                res.json(value)
            } else {
                res.send()
            }
        })
    }
}
