import { GeneralResponseErrorDetail, GeneralResponseTemp, ResponseCode } from "src/common-module/dto/general-response.dto";

export class MainErrorDetail extends GeneralResponseErrorDetail {
    static readonly TASK_ASSIGNEE_TO_OTHER_USER: GeneralResponseTemp = { errorCode: '3101', message: 'Điều khoản đang được gán cho user khác xử lý', code: ResponseCode.ERROR }
    static readonly TERMS_NOT_IN_MAINTAINING: GeneralResponseTemp = { errorCode: '3102', message: 'Điều khoản đang không ở trạng thái điều chỉnh', code: ResponseCode.ERROR }
    static readonly CAN_NOT_CLEAR_MAINTAINING_FLAG: GeneralResponseTemp = { errorCode: '3103', message: 'Không thể xóa trạng thái đang điều chỉnh', code: ResponseCode.ERROR }
    static readonly TERMS_IN_MAINTAINING: GeneralResponseTemp = { errorCode: '3104', message: 'Điều khoản đang ở trạng thái điều chỉnh', code: ResponseCode.ERROR }
    static readonly TERMS_NOT_IN_WAITING_APPROVAL_STATE: GeneralResponseTemp = { errorCode: '3105', message: 'Điều khoản đang không ở trạng thái chờ phê duyệt', code: ResponseCode.ERROR }
    static readonly CUSTOMER_NOT_ACCEPTED: GeneralResponseTemp = { errorCode: '3107', message: 'Khách hàng chưa chấp thuận điều khoản', code: ResponseCode.ERROR }
    static readonly CUSTOMER_ACCEPTED_TERMS_VALUE_CHANGED: GeneralResponseTemp = { errorCode: '3106', message: 'Khách hàng đã chấp thuận, điều khoản bị thay đổi', code: ResponseCode.ERROR }
    static readonly TERMS_NOT_APPROVED: GeneralResponseTemp = { errorCode: '3108', message: 'Điều khoản chưa được phê duyệt', code: ResponseCode.ERROR }
}