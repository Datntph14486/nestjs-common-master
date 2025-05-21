export class GeneralResponse {
    code: ResponseCode = ResponseCode.SUCCESS;
    transactionTime = new Date().getTime();

    errorCode?: string;
    category?: string;
    subCategory?: string;
    message?: string;
    messageDetail?: string;

    value?: any;

    /**
     * Tạo đối tượng General Response từ GeneralResponseTemp
     * @param errorCodeDetail 
     * @param option 
     * @returns 
     */
    static getInstance(errorCodeDetail: GeneralResponseTemp, options?: { message?: string, value?: any }): GeneralResponse {
        let __gr = new GeneralResponse()
        __gr.code = errorCodeDetail.code || __gr.code
        __gr.errorCode = errorCodeDetail.errorCode
        __gr.message = options?.message || errorCodeDetail.message
        __gr.value = options?.value
        return __gr
    }
}

export enum ResponseCode {
    SUCCESS = 0,
    ERROR = -1,
    ERROR_CAN_RETRY = -2
}

export class GeneralResponseErrorDetail {
    static readonly PARAMS_VALIDATION_ERROR: GeneralResponseTemp = { errorCode: '2000', message: 'Truyền thiếu hoặc sai tham số', code: ResponseCode.ERROR }
    static readonly EXECEPTION_ERROR: GeneralResponseTemp = { errorCode: '9000', message: 'Lỗi ngoại lệ', code: ResponseCode.ERROR }
    static readonly INTERNAL_SERVER_ERROR: GeneralResponseTemp = { errorCode: '9000', message: 'Lỗi ngoại lệ', code: ResponseCode.ERROR }
    static readonly NOT_FOUND_ERROR: GeneralResponseTemp = { errorCode: '3001', message: 'Bản ghi không tồn tại', code: ResponseCode.ERROR }
    static readonly NOT_FOUND: GeneralResponseTemp = { errorCode: '3001', message: 'Bản ghi không tồn tại', code: ResponseCode.ERROR }
}

/**
 * Kiểu dữ liệu sinh GeneralResponse nhanh
 */
export type GeneralResponseTemp = {
    code?: ResponseCode
    errorCode: string
    message: string
}