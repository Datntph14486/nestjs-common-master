import { Controller, Get, Req, Res } from '@nestjs/common';
import { TermsCustService } from '../../service/terms-cust/terms-cust.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';
import { GeneralResponse } from 'src/common-module/dto/general-response.dto';
import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { DataTableFilter } from 'src/common-module/dto/data-table-filter.dto';
import { DataTableResponse } from 'src/common-module/dto/data-table-response.dto';
import { TermsCust } from 'src/main-module/entity/terms-cust/terms-cust.entity';
import { MainErrorDetail } from 'src/main-module/utils/error-detail';

@Controller('/api/v1/terms-cust')
export class TermsCustController extends BaseEntityController {
    constructor(public entityService: TermsCustService) {
        super(entityService)
    }

    @Get(['/load-data-table', '/loadDataTable'])
    override async loadDataTable(@Req() request: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        if (request.query.filters) {
            request.query.filters = JSON.parse(request.query.filters.toString())
        }
        let dataTableFilter = plainToClass(DataTableFilter, request.query, {
            enableImplicitConversion: true,
        })

        let loadDataTableMethod: Promise<[any[], number]>
        if (request.query['mt'] === 'qb') {
            loadDataTableMethod = this.entityService.loadDataTableUsingQueryBuilder(dataTableFilter)
        } else {
            loadDataTableMethod = this.entityService.loadDataTable<TermsCust>(dataTableFilter, {
                relations: {
                    terms: true
                }
            })
        }
        try {
            let data: any = await loadDataTableMethod
            let dataTableResponse = new DataTableResponse()
            dataTableResponse.first = dataTableFilter.first;
            dataTableResponse.rows = dataTableFilter.rows;
            dataTableResponse.items = data[0].map((item: any) => {
                item.terms = this.entityService.modifyData(item.terms, [
                    'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'content', 'options', 'maintaining', 'state', 'assignee'
                ]);
                item = this.entityService.modifyData(item, this.__getExcludeKeys);
                return item
            });
            dataTableResponse.totalRows = data[1];
            return dataTableResponse;
        } catch (e) {
            res.status(500)
            return GeneralResponse.getInstance(MainErrorDetail.EXECEPTION_ERROR, { message: e.message });
        }
    }
}
