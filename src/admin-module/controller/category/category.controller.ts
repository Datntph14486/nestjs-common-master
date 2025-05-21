import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { CategoryService } from '../../service/category/category.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';
import { Request, Response } from 'express';
import { GeneralResponse, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { CategoryData } from 'src/admin-module/entity/category-data/category-data.entity';
import { Category } from 'src/admin-module/entity/category/category.entity';

@Controller('/api/v1/category')
export class CategoryController extends BaseEntityController {
    constructor(public entityService: CategoryService) {
        super(entityService)
    }

    @Get('/:id(\\d+)/data')
    data(@Param('id') id: number, @Res() res: Response) {
        this.entityService.get(id, { relations: { data: true } }).then((item: Category) => {
            let __item: any
            if (item) {
                __item = this.entityService.modifyData(item, this.__getExcludeKeys)
                res.json(__item.data)
                return
            }
            res.status(404).send()
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get('/data')
    dataByCode(@Req() req: Request, @Res() res: Response) {
        this.entityService.getCategoryData(req.query['code'].toString()).then((items: any) => {
            let __items = items.map((item: CategoryData) => {
                item.category = this.entityService.modifyData(item.category, ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'])
                return this.entityService.modifyData(item, ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'])
            })
            res.send(__items)
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get('/getCategoryData')
    getCategoryData(@Req() req: Request, @Res() res: Response) {
        this.entityService.getCategoryData(req.query['categoryCode'].toString(), req.query['code'].toString()).then((items: any) => {
            let __items = items.map((item: CategoryData) => {
                item.category = this.entityService.modifyData(item.category, ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'])
                return this.entityService.modifyData(item, ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'])
            })
            res.send(__items)
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get('/getCategoryDataByCategoryCode')
    getCategoryDataByCategoryCode(@Req() req: Request, @Res() res: Response) {
        this.entityService.getCategoryData(req.query['categoryCode'].toString()).then((items: any) => {
            let __items = items.map((item: CategoryData) => {
                item.category = this.entityService.modifyData(item.category, ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'])
                return this.entityService.modifyData(item, ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'])
            })
            res.send(__items)
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }
}
