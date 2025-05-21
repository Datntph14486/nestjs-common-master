import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Terms, TermsState } from '../../entity/terms/terms.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { GeneralResponse } from 'src/common-module/dto/general-response.dto';
import * as _ from 'lodash';
import { MainErrorDetail } from 'src/main-module/utils/error-detail';
import { TermsHist } from 'src/main-module/entity/terms-hist/terms-hist.entity';

@Injectable()
export class TermsService extends BaseEntityService {
    private readonly log = new Logger(TermsService.name)

    constructor(@InjectRepository(Terms) public entityRepository: Repository<Terms>,
        @InjectRepository(TermsHist) public termHistRepository: Repository<TermsHist>) {
        super(entityRepository);
    }

    override get(id: any, options?: { relations?: FindOptionsRelations<any>; }): Promise<any> {
        return super.get<Terms>(id, { relations: { history: false } })
    }

    /**
     * Chuyển trạng thái cho điều khoản
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70474
     * @param terms 
     * @param maintaining 
     * @param options 
     * @returns 
     */
    async setMaintaining(terms: Terms, maintaining: boolean, options: { userDetail?: UserDetail }): Promise<GeneralResponse> {
        let __gr: GeneralResponse = new GeneralResponse()

        if (!_.isEmpty(terms.assignee) && terms.assignee !== options?.userDetail?.username) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.TASK_ASSIGNEE_TO_OTHER_USER)
            return __gr
        }

        if (maintaining) {
            terms.state = TermsState.EDITING
            terms.assignee = options?.userDetail?.username
        } else {
            terms.state = TermsState.WAITING_FOR_APPROVAL
            terms.assignee = null
        }

        terms.maintaining = maintaining
        terms.updatedBy = options?.userDetail?.username
        terms.updatedAt = new Date()

        try {
            terms = await this.entityRepository.save(terms)
            __gr.value = terms
        } catch (ex) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.EXECEPTION_ERROR, { message: ex.message })
            return __gr
        }

        return __gr
    }

    /**
     * Cập nhật nội dung điều khoản
     * 
     * http://10.100.20.67:81/pages/viewpage.action?pageId=70280
     * @param terms 
     * @param content 
     * @param options 
     * @returns 
     */
    async updateContent(terms: Terms, content: string, options: { userDetail?: UserDetail }): Promise<GeneralResponse> {
        let __gr: GeneralResponse = new GeneralResponse()

        if (terms.maintaining !== true) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.TERMS_NOT_IN_MAINTAINING)
            return __gr
        }

        if (terms.assignee !== options?.userDetail?.username) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.TASK_ASSIGNEE_TO_OTHER_USER)
            return __gr
        }

        terms.content = content
        terms.version = (terms.version || 1) + 1
        this.log.log(`set version of terms with id ${terms.id} to version ${terms.version}`)

        terms.updatedBy = options?.userDetail?.username
        terms.updatedAt = new Date()

        try {
            terms = await this.entityRepository.save(terms)
            __gr.value = terms
        } catch (ex) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.EXECEPTION_ERROR, { message: ex.message })
            return __gr
        }

        return __gr
    }

    /**
     * Phê duyệt nội dung điều khoản
     * @param terms 
     * @param approve 
     * @param options 
     * @returns 
     */
    async approve(terms: Terms, approve: boolean, options: { userDetail?: UserDetail }): Promise<GeneralResponse> {
        let __gr: GeneralResponse = new GeneralResponse()

        if (terms.maintaining === true) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.TERMS_IN_MAINTAINING)
            return __gr
        }

        if (terms.state !== TermsState.WAITING_FOR_APPROVAL) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.TERMS_NOT_IN_WAITING_APPROVAL_STATE)
            return __gr
        }

        terms.state = approve ? TermsState.APPROVED : TermsState.REJECTED
        terms.updatedBy = options?.userDetail?.username
        terms.updatedAt = new Date()

        try {
            terms = await this.entityRepository.save(terms)
            __gr.value = terms
        } catch (ex) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.EXECEPTION_ERROR, { message: ex.message })
            return __gr
        }

        return __gr
    }

    /**
     * Trả về điều khoản đã được phê duyệt theo UUID
     * 
     * Mã lỗi: 3001, 3108, 9000
     * @param uuid 
     * @param options 
     */
    async getApprovedTermsByUUID(uuid: string, options?: any): Promise<GeneralResponse> {
        let __gr = new GeneralResponse()
        let terms: Terms = await this.entityRepository.findOne({
            where: {
                uuid: uuid
            }
        })

        if (!terms) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.NOT_FOUND_ERROR)
            return __gr
        }

        if (terms.state === TermsState.APPROVED) {
            __gr.value = terms
            return __gr
        }

        let termsHistList: TermsHist[] = await this.termHistRepository.find({
            where: {
                terms: {
                    uuid: uuid
                },
                state: TermsState.APPROVED
            },
            order: {
                id: 'DESC'
            },
            take: 1
        })
        if (termsHistList.length == 0) {
            __gr = GeneralResponse.getInstance(MainErrorDetail.TERMS_NOT_APPROVED)
            return __gr
        }
        let __termHist: TermsHist = termsHistList.at(0)
        this.log.log(`load content of terms with id ${terms.id} from hist version ${__termHist.version}...`)
        terms.content = __termHist.content
        terms.version = __termHist.version
        __gr = new GeneralResponse()
        __gr.value = terms

        return __gr
    }
}
