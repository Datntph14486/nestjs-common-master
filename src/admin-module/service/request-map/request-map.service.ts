import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestMap } from '../../entity/request-map/request-map.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class RequestMapService extends BaseEntityService {
    constructor(@InjectRepository(RequestMap) public entityRepository: Repository<RequestMap>) {
        super(entityRepository);
    }
}
