import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FormField } from 'src/common-module/dto/form/form-field.dto';
import { Request, Response } from 'express';
import { Validator } from 'src/common-module/utils/validator/validator';
import { GeneralResponse, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { OpenAPIGuard } from 'src/open-api-module/guard/open-api.guard';
import { TermsMBAService } from 'src/main-module/service/terms/terms.mba.service';
import { TermsService } from 'src/main-module/service/terms/terms.service';

@Controller('/mba/api/v1/terms')
export class TermsMBAController {

    constructor(public entityService: TermsService,
        public entityMBAService: TermsMBAService) {
    }

    __acceptDtoContraints: FormField[] = [
        { code: 'uuid', required: true, type: 'text' },
    ]
    /**
     * API cho phép khách hàng chấp thuận điều khoản theo UUID
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70340
     * @param body 
     * @param req 
     * @param res 
     * @returns 
     */
    @UseGuards(OpenAPIGuard)
    @Post('/accept')
    async accept(@Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let __gr: GeneralResponse = Validator.validate(this.__acceptDtoContraints, body)
        if (__gr.code !== ResponseCode.SUCCESS) {
            return __gr
        }

        __gr = await this.entityMBAService.accept(body.uuid, { userDetail: req['userDetail'] })

        return __gr
    }

    __findDtoContraints: FormField[] = [
        { code: 'uuid', required: true, type: 'text' },
    ]
    /**
     * API trả về thông tin điều khoản theo UUID
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70345
     * @param queryParams 
     * @param req 
     * @param res 
     * @returns 
     */
    @UseGuards(OpenAPIGuard)
    @Get('/find')
    async find(@Query() queryParams: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let __gr: GeneralResponse = Validator.validate(this.__acceptDtoContraints, queryParams)
        if (__gr.code !== ResponseCode.SUCCESS) {
            return __gr
        }

        __gr = await this.entityMBAService.find(queryParams.uuid, { userDetail: req['userDetail'] })
        return __gr
    }
}
