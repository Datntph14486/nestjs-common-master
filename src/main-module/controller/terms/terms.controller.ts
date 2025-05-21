import { Body, Controller, Get, Param, Put, Req, Res } from '@nestjs/common';
import { TermsService } from '../../service/terms/terms.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';
import { FormField } from 'src/common-module/dto/form/form-field.dto';
import { Request, Response } from 'express';
import { Validator } from 'src/common-module/utils/validator/validator';
import { GeneralResponse, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { Terms } from 'src/main-module/entity/terms/terms.entity';
import { MainErrorDetail } from 'src/main-module/utils/error-detail';

@Controller('/api/v1/terms')
export class TermsController extends BaseEntityController {
    __getDetailExcludeKeys: string[] = [
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy',
    ]

    override __getExcludeKeys: string[] = [
        'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'content', 'options'
    ]

    override __createExcludeFields: string[] = [
        'id', 'uuid', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'version', 'state', 'maintaining', 'assignee'
    ]

    override  __createDtoContraints: FormField[] = [
        { code: 'programCode', required: true, type: 'text', minLength: 6, maxLength: 32 },
        { code: 'name', required: true, type: 'text', minLength: 6, maxLength: 32 },
        { code: 'content', required: true, type: 'text' },
    ]

    override __updateExcludeFields: string[] = [
        'id', 'uuid', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'version', 'name', 'state', 'maintaining', 'assignee'
    ]

    override  __updateDtoContraints: FormField[] = [
        { code: 'programCode', required: true, type: 'text', minLength: 6, maxLength: 32 },
    ]

    constructor(public entityService: TermsService) {
        super(entityService)
    }

    @Get('/:id(\\d+)')
    async get(@Param('id') id: number, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        try {
            let item: any = await this.entityService.get(id)
            let __item: any
            if (item) {
                __item = this.entityService.modifyData(item, this.__getDetailExcludeKeys)
                return __item
            }
            res.status(404)
            return GeneralResponse.getInstance(MainErrorDetail.NOT_FOUND_ERROR)
        } catch (e) {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500)
            return generalResponse
        }
    }

    __setMaintainingDtoContraints: FormField[] = [
        { code: 'maintaining', required: true, type: 'text' },
    ]
    /**
     * Chuyển trạng thái điều khoản sang đang chỉnh sửa
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70682
     * @param id 
     * @param body 
     * @param req 
     * @param res 
     * @returns 
     */
    @Put('/:id(\\d+)/set-maintaining')
    async setMaintaining(@Param('id') id: number, @Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let __gr: GeneralResponse = Validator.validate(this.__setMaintainingDtoContraints, body)
        if (__gr.code !== ResponseCode.SUCCESS) {
            return __gr
        }

        let item: Terms = await this.entityService.get(id)
        if (!item) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.NOT_FOUND_ERROR)
            return __gr
        }

        __gr = await this.entityService.setMaintaining(item, body.maintaining, { userDetail: req['userDetail'] })
        if (__gr.code === ResponseCode.SUCCESS) {
            __gr.value = this.entityService.modifyData(__gr.value, this.__getDetailExcludeKeys)
        }

        return __gr
    }

    __updateContentDtoContraints: FormField[] = [
        { code: 'content', required: true, type: 'text' },
    ]
    /**
     * Cập nhật nội dung điều khoản
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70709
     * @param id 
     * @param body 
     * @param req 
     * @param res 
     * @returns 
     */
    @Put('/:id(\\d+)/update-content')
    async updateContent(@Param('id') id: number, @Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let __gr: GeneralResponse = Validator.validate(this.__updateContentDtoContraints, body)
        if (__gr.code !== ResponseCode.SUCCESS) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.PARAMS_VALIDATION_ERROR, { value: __gr.value })
            return __gr
        }

        let item: Terms = await this.entityService.get(id)
        if (!item) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.NOT_FOUND_ERROR)
            return __gr
        }

        __gr = await this.entityService.updateContent(item, body.content, { userDetail: req['userDetail'] })
        if (__gr.code === ResponseCode.SUCCESS) {
            __gr.value = this.entityService.modifyData(__gr.value, this.__getDetailExcludeKeys)
        }

        return __gr
    }

    __approveContentDtoContraints: FormField[] = [
        { code: 'approve', required: true, type: 'text' },
    ]
    /**
     * API Phê duyệt nội dung điều khoản
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70716
     * @param id 
     * @param body 
     * @param req 
     * @param res 
     * @returns 
     */
    @Put('/:id(\\d+)/approve')
    async approve(@Param('id') id: number, @Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let __gr: GeneralResponse = Validator.validate(this.__approveContentDtoContraints, body)
        if (__gr.code !== ResponseCode.SUCCESS) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.PARAMS_VALIDATION_ERROR, { value: __gr.value })
            return __gr
        }

        let item: Terms = await this.entityService.get(id)
        if (!item) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.NOT_FOUND_ERROR)
            return __gr
        }

        __gr = await this.entityService.approve(item, body.approve, { userDetail: req['userDetail'] })
        if (__gr.code === ResponseCode.SUCCESS) {
            __gr.value = this.entityService.modifyData(__gr.value, this.__getDetailExcludeKeys)
        }

        return __gr
    }
}
