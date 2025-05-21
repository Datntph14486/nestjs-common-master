import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryData } from '../../entity/category-data/category-data.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class CategoryDataService extends BaseEntityService {
    constructor(@InjectRepository(CategoryData) public entityRepository: Repository<CategoryData>) {
        super(entityRepository);
    }
}
