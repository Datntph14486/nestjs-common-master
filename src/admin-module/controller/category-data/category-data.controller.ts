import { Controller } from '@nestjs/common';
import { CategoryDataService } from '../../service/category-data/category-data.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller(['/api/v1/category-data', '/api/v1/categoryData'])
export class CategoryDataController extends BaseEntityController {
    constructor(public entityService: CategoryDataService) {
        super(entityService)
    }
}
