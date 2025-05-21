import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { BaseEntityController } from '../../../common-module/controller/base-entity/base-entity.controller';
import { Request, Response } from 'express';
import { GeneralResponse, GeneralResponseErrorDetail, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { Body, Delete, Get, Param, Put } from '@nestjs/common/decorators';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { plainToClass } from 'class-transformer';
import { DataTableFilter } from 'src/common-module/dto/data-table-filter.dto';
import { DataTableResponse } from 'src/common-module/dto/data-table-response.dto';
import { Menu } from 'src/admin-module/entity/menu/menu.entity';
import { User } from 'src/admin-module/entity/user/user.entity';
import * as _ from 'lodash';

@Controller('/api/v1/user')
export class UserController extends BaseEntityController {
    constructor(public entityService: UserService) {
        super(entityService)
        this.__getExcludeKeys = this.__getExcludeKeys.concat(['password'])
        this.__updateExcludeFields = this.__updateExcludeFields.concat(['username', 'accountExpired', 'accountLocked', 'passwordExpired',])
        this.__createExcludeFields = this.__createExcludeFields.concat(['enabled', 'accountExpired', 'accountLocked', 'passwordExpired',])
    }

    @Post()
    override async save(@Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<GeneralResponse> {
        body = this.entityService.modifyData(body, this.__createExcludeFields)
        let __userDetail: UserDetail = req['userDetail']
        if (__userDetail) {
            body['createdBy'] = __userDetail.username
        }

        try {
            let item: User = await this.entityService.save(body, { userDetail: __userDetail })
            if (item == null) {
                res.status(404)
                return GeneralResponse.getInstance(GeneralResponseErrorDetail.NOT_FOUND_ERROR)
            }
            return this.entityService.modifyData(item, this.__getExcludeKeys)
        } catch (e) {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500)
            return generalResponse
        }
    }

    @Put('/:id(\\d+)')
    override async update(@Param('id') id: Number, @Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        body = this.entityService.modifyData(body, this.__updateExcludeFields)

        let __userDetail: UserDetail = req['userDetail']
        if (__userDetail) {
            body['updatedBy'] = __userDetail.username
        }

        try {
            let item: any = await this.entityService.update(id, body, { userDetail: req['userDetail'] })
            if (!item) {
                res.status(404).send()
                return
            }
            return this.entityService.modifyData(item, this.__getExcludeKeys)
        } catch (e) {
            res.status(500)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
        }
    }

    @Delete('/:id(\\d+)')
    override async delete(@Param('id') id: Number, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let __userDetail: UserDetail = req['userDetail']

        try {
            let item: any = await this.entityService.delete(id, { userDetail: __userDetail })
            if (!item) {
                res.status(HttpStatus.NOT_FOUND)
                return GeneralResponse.getInstance(GeneralResponseErrorDetail.NOT_FOUND_ERROR)
            }
            return this.entityService.modifyData(item, this.__getExcludeKeys)
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
        }
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
            loadDataTableMethod = this.entityService.loadDataTableUsingQueryBuilder<User>(dataTableFilter, { relations: { personal: true } })
        } else {
            loadDataTableMethod = this.entityService.loadDataTable<User>(dataTableFilter, { relations: { personal: true } })
        }

        try {
            let data = await loadDataTableMethod
            let dataTableResponse = new DataTableResponse()
            dataTableResponse.first = dataTableFilter.first;
            dataTableResponse.rows = dataTableFilter.rows;
            dataTableResponse.items = data[0].map((item: any) => {
                item.personal = this.entityService.modifyData(item.personal, this.__getExcludeKeys);
                return this.entityService.modifyData(item, this.__getExcludeKeys);
            });
            dataTableResponse.totalRows = data[1];
            return dataTableResponse;
        } catch (e) {
            let generalResponse = new GeneralResponse();
            generalResponse.code = ResponseCode.ERROR;
            generalResponse.message = e.message;
            res.status(500)
            return generalResponse;
        }
    }

    @Post('/login')
    login(@Req() req: Request, @Res() res: Response) {
        this.entityService.login(req.body['username'], req.body['password']).then((value) => {
            if (!value) {
                res.status(401).send()
                return
            }
            res.json(value)
        }).catch(e => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get('/logout')
    logout(@Req() req: Request, @Res() res: Response) {
        res.send()
    }

    @Post('/sessionExtend')
    sessionExtend(@Req() req: Request, @Res() res: Response) {
        res.status(401).send()
    }

    @Get('/getCurrentUser')
    getCurrentUser(@Req() req: Request, @Res() res: Response) {
        let userDetail: UserDetail = req['userDetail']
        this.entityService.findByUsername(userDetail.username).then((item: any) => {
            let __item: any
            if (item) {
                __item = this.entityService.modifyData(item, this.__getExcludeKeys)
                res.json(__item)
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

    @Get('/menu')
    menu(@Req() req: Request, @Res() res: Response) {
        let userDetail: UserDetail = req['userDetail']
        this.entityService.menu(userDetail).then((items: Menu[]) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.SUCCESS
            generalResponse.value = items
            res.send(generalResponse)
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get(['/info'])
    info(@Req() req: Request, @Res() res: Response) {
        let userDetail: UserDetail = req['userDetail']
        this.entityService.findByUsername(userDetail.username, { relations: { personal: true } }).then((user: User) => {
            user = this.entityService.modifyData(user, this.__getExcludeKeys)
            user.personal = this.entityService.modifyData(user.personal, this.__getExcludeKeys)
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.SUCCESS
            generalResponse.value = user
            res.send(generalResponse)
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Put('/update-profile')
    updateProfile(@Body() body: any, @Req() req: Request, @Res() res: Response) {
        body = this.entityService.modifyData(body, this.__updateExcludeFields)
        let __userDetail: UserDetail = req['userDetail']
        if (__userDetail) {
            body['updatedBy'] = __userDetail.username
        }

        this.entityService.updateProfile(__userDetail.username, body).then(item => {
            if (!item) {
                res.status(404).send()
                return
            }
            res.send(this.entityService.modifyData(item, this.__getExcludeKeys))
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }
}
