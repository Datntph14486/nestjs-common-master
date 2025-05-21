import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermsHist } from '../../entity/terms-hist/terms-hist.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class TermsHistService extends BaseEntityService {
    constructor(@InjectRepository(TermsHist) public entityRepository: Repository<TermsHist>) {
        super(entityRepository);
    }
}
