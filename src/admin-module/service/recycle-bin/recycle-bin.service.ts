import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecycleBin } from '../../entity/recycle-bin/recycle-bin.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class RecycleBinService extends BaseEntityService {
    constructor(@InjectRepository(RecycleBin) public entityRepository: Repository<RecycleBin>) {
        super(entityRepository);
    }
}
