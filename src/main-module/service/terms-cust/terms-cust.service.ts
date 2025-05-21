import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermsCust } from '../../entity/terms-cust/terms-cust.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class TermsCustService extends BaseEntityService {
    constructor(@InjectRepository(TermsCust) public entityRepository: Repository<TermsCust>) {
        super(entityRepository);
    }
}
