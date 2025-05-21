import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personal } from '../../entity/personal/personal.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class PersonalService extends BaseEntityService {
    constructor(@InjectRepository(Personal) public entityRepository: Repository<Personal>) {
        super(entityRepository);
    }
}
