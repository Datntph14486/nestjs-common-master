import { Body, Controller, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { RoleService } from 'src/admin-module/service/role/role.service';
import { BaseEntityController } from '../../../common-module/controller/base-entity/base-entity.controller';
import { Request, Response } from 'express';
import { GeneralResponse, GeneralResponseErrorDetail, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { Role } from 'src/admin-module/entity/role/role.entity';

@Controller('api/v1/role')
export class RoleController extends BaseEntityController {
    constructor(public entityService: RoleService) {
        super(entityService)
    }

    @Get()
    override async index(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let userDetail: UserDetail = req['userDetail']
        try {
            let items: Role[] = await this.entityService.listByPriority({ userDetail: userDetail })
            let __items = items.map((item: any) => {
                return this.entityService.modifyData(item, this.__getExcludeKeys)
            })
            return __items
        } catch (e) {
            let generalResponse = GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
            res.status(500)
            return generalResponse
        }
    }

    @Get(['/:id(\\d+)/menu-ids', '/:id(\\d+)/get-menu-ids', '/:id(\\d+)/getMenuIds'])
    menuIds(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        this.entityService.menuIds(id).then((rs) => {
            res.send(rs)
        })
    }

    @Put(['/:id(\\d+)/update-menu', '/:id(\\d+)/updateMenu'])
    updateMenu(@Param('id') id: number, @Body() body: any | any[], @Req() req: Request, @Res() res: Response) {
        this.entityService.updateMenu(id, body).then((rs) => {
            res.send(rs)
        })
    }
}
