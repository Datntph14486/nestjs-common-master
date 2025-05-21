import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Terms } from '../../entity/terms/terms.entity';
import * as _ from 'lodash';
import { GeneralResponse, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { TermsCust } from 'src/main-module/entity/terms-cust/terms-cust.entity';
import { TermsService } from './terms.service';
import { MainErrorDetail } from 'src/main-module/utils/error-detail';

@Injectable()
export class TermsMBAService {
    private readonly log = new Logger(TermsMBAService.name)

    constructor(@InjectRepository(Terms) public entityRepository: Repository<Terms>,
        @InjectRepository(TermsCust) public termsCustRepository: Repository<TermsCust>,
        private termsService: TermsService) {
    }

    /**
     * 
     * @param uuid 
     * @param options 
     * @returns 
     */
    async accept(uuid: string, options?: { userDetail: UserDetail }): Promise<GeneralResponse> {
        let __gr = new GeneralResponse()

        __gr = await this.termsService.getApprovedTermsByUUID(uuid, options)
        if (__gr.code !== ResponseCode.SUCCESS) {
            return __gr
        }

        let __termsCust: TermsCust = new TermsCust()
        __termsCust.terms = __gr.value
        __termsCust.termsVersion = __gr.value.version
        __termsCust.custodyCd = options?.userDetail?.username

        try {
            __gr = new GeneralResponse()
            __termsCust = await this.termsCustRepository.save(__termsCust)
            __gr.value = __termsCust
        } catch (ex) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.EXECEPTION_ERROR, { message: ex.message })
        }

        return __gr
    }

    /**
     * Lấy thông tin điều khoản đã được phê duyệt
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70494
     * @param uuid 
     * @param options 
     * @returns 
     */
    async find(uuid: string, options?: { userDetail: UserDetail }): Promise<GeneralResponse> {
        let __gr = new GeneralResponse()
        __gr = await this.termsService.getApprovedTermsByUUID(uuid, { userDetail: options?.userDetail })
        if (__gr.code !== ResponseCode.SUCCESS) {
            return __gr
        }
        let __approvedTerms: Terms = __gr.value
        let __termsCustList: TermsCust[] = await this.termsCustRepository.find({
            where: {
                custodyCd: options?.userDetail?.username,
                terms: {
                    id: __approvedTerms.id
                }
            },
            order: {
                id: 'DESC'
            },
            take: 1
        })

        if (__termsCustList.length === 0) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.CUSTOMER_NOT_ACCEPTED, {
                value: {
                    uuid: __approvedTerms.uuid,
                    content: __approvedTerms.content,
                    version: __approvedTerms.version,
                    accepted: false,
                }
            })
            return __gr
        }

        let __termsCust: TermsCust = __termsCustList.at(0)
        if (__termsCust.termsVersion != __approvedTerms.version) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.CUSTOMER_ACCEPTED_TERMS_VALUE_CHANGED, {
                value: {
                    uuid: __approvedTerms.uuid,
                    content: __approvedTerms.content,
                    version: __approvedTerms.version,
                    accepted: true,
                    acceptedVersion: __termsCust.termsVersion
                }
            })
            return __gr
        }

        __gr = new GeneralResponse()
        __gr.value = {
            uuid: __approvedTerms.uuid,
            content: __approvedTerms.content,
            version: __approvedTerms.version,
            accepted: true,
            acceptedVersion: __termsCust.termsVersion
        }
        return __gr
    }
}
