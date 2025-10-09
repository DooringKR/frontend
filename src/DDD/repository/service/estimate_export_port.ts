import { Response } from '@/DDD/data/response'

export interface EstimateExportPort {
  /** Trigger export of an order estimate (spreadsheet generation) */
  exportOrderEstimate(orderId: string): Promise<Response<{ sheetId?: string }>>
}
