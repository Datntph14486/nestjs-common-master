import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entity/category/category.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import { CategoryData } from 'src/admin-module/entity/category-data/category-data.entity';

@Injectable()
export class CategoryService extends BaseEntityService {
    constructor(@InjectRepository(Category) public entityRepository: Repository<Category>,
        @InjectRepository(CategoryData) public categoryDataRepository: Repository<CategoryData>) {
        super(entityRepository);
    }

    getCategoryData(code: string, categoryDataCode?: string): Promise<any> {
        let __whereClause: string
        let __whereParams: any = {}
        if (categoryDataCode) {
            __whereClause = `category.code = :code and categoryData.code = :categoryDataCode`
            __whereParams = { categoryDataCode: categoryDataCode, code: code }
        } else {
            __whereClause = `category.code = :code`
            __whereParams = { code: code }
        }
        return new Promise((resolve, reject) => {
            this.categoryDataRepository.createQueryBuilder('categoryData')
                .leftJoinAndSelect('categoryData.category', 'category')
                .where(__whereClause, __whereParams).getMany().then((items) => {
                    resolve(items)
                }).catch((e) => {
                    reject(e)
                })
        })
    }
}
