import { Injectable, Logger } from "@nestjs/common";
import * as _ from "lodash";
import { CategoryData } from "src/admin-module/entity/category-data/category-data.entity";
import { CategoryService } from "src/admin-module/service/category/category.service";
import { GeneralResponse, ResponseCode } from "src/common-module/dto/general-response.dto";
import { MemCacheAdapter } from "src/common-module/utils/cache/mem-cache-adapter";
import { Validator } from "src/common-module/utils/validator/validator";

@Injectable()
export class ValidatorUtils {
    private readonly log = new Logger(ValidatorUtils.name)

    constructor(private categoryService: CategoryService, private memCacheAdapter: MemCacheAdapter) { }

    /**
     * Kiểm tra dữ liệu truyền lên theo thông tin cấu hình trong danh mục
     * 
     * options.failureIfNull = true --> trả lỗi nếu không tìm được thông tin cấu hình trong danh mục
     * @param categoryCode 
     * @param categoryDataCode 
     * @param data  Dữ liệu cần kiểm tra 
     * @param options 
     * @returns 
     */
    async validate(categoryCode: string, categoryDataCode: string, data: any, options?: { failureIfNull: boolean }): Promise<GeneralResponse> {
        let generalResponse = new GeneralResponse()
        if ((_.isEmpty(categoryCode) || _.isEmpty(categoryDataCode)) && options?.failureIfNull) {
            generalResponse.code = ResponseCode.ERROR
            return generalResponse
        }

        let key = `category_data.${categoryCode}.${categoryDataCode}`
        let categoryDataLst: CategoryData[] = await this.memCacheAdapter.wrap(key, () => {
            this.log.debug(`calc ${key} from db...`)
            return this.categoryService.getCategoryData(categoryCode, categoryDataCode)
        }, 10000)
        if (categoryDataLst.length === 0) {
            if (options?.failureIfNull) {
                generalResponse.code = ResponseCode.ERROR
            }
            return generalResponse
        }
        return Validator.validate(categoryDataLst[0].props, data)
    }
}