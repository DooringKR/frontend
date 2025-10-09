import { EstimateExportPort } from '@/DDD/repository/service/estimate_export_port'
import { OrderRepository } from '@/DDD/repository/db/CartNOrder/order_repository'
import { Response } from '@/DDD/data/response'

export class GenerateOrderEstimateUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly exporter: EstimateExportPort
  ) {}

  async execute(orderId: string): Promise<Response<{ sheetId?: string }>> {
    try {
      // 간단 검증: 주문 존재 여부
      const orderResp = await this.orderRepository.findOrderById(orderId)
      if (!orderResp.success || !orderResp.data) {
        return { success: false, data: { sheetId: undefined }, message: 'ORDER_NOT_FOUND' }
      }

      const result = await this.exporter.exportOrderEstimate(orderId)
      if (!result.success) {
        return { success: false, data: { sheetId: result.data?.sheetId }, message: result.message || 'EXPORT_FAILED' }
      }
      return { success: true, data: { sheetId: result.data?.sheetId }, message: 'EXPORT_TRIGGERED' }
    } catch (e: any) {
      return { success: false, data: { sheetId: undefined }, message: e?.message || 'UNKNOWN_ERROR' }
    }
  }
}
