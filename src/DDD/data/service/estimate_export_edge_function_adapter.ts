import { createClient } from '@supabase/supabase-js'
import { EstimateExportPort } from '@/DDD/repository/service/estimate_export_port'
import { Response } from '@/DDD/data/response'

// Adapter responsible for invoking the Supabase Edge Function that posts to Apps Script.
export class EstimateExportEdgeFunctionAdapter implements EstimateExportPort {
  private supabase
  constructor(
    url: string = process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) {
    this.supabase = createClient(url, anonKey)
  }

  async exportOrderEstimate(orderId: string): Promise<Response<{ sheetId?: string }>> {
    try {
      // Debug controls: enable by setting NEXT_PUBLIC_ORDERS_GOOGLE_DEBUG=true or localStorage('ORDERS_GOOGLE_DEBUG'='1')
  const envDebug = (process.env.NEXT_PUBLIC_ORDERS_GOOGLE_DEBUG || '').toLowerCase() === 'true' || process.env.NEXT_PUBLIC_ORDERS_GOOGLE_DEBUG === '1'
  const envEcho = (process.env.NEXT_PUBLIC_ORDERS_GOOGLE_ECHO || '').toLowerCase() === 'true' || process.env.NEXT_PUBLIC_ORDERS_GOOGLE_ECHO === '1'
  const lsDebug = typeof window !== 'undefined' && (window.localStorage.getItem('ORDERS_GOOGLE_DEBUG') === '1' || window.localStorage.getItem('ORDERS_GOOGLE_DEBUG') === 'true')
  const lsEcho = typeof window !== 'undefined' && (window.localStorage.getItem('ORDERS_GOOGLE_ECHO') === '1' || window.localStorage.getItem('ORDERS_GOOGLE_ECHO') === 'true')
  const debugMode = !!(envDebug || lsDebug)
  const echoMode = !!(envEcho || lsEcho)

  const { data, error } = await this.supabase.functions.invoke('orders-google', { body: { orderId, debug: debugMode, returnPayload: echoMode || debugMode } })
      if (error) {
        return { success: false, message: error.message, data: { sheetId: undefined } }
      }
      // If edge function returned structured failure (ok:false) but not thrown as supabase-js error
      if (data && data.ok === false) {
        const detail = [data.stage, data.error, data.status].filter(Boolean).join(' | ')
        return { success: false, message: detail || 'Edge function logical failure', data: { sheetId: undefined } }
      }
      // If debug mode, surface payload for inspection
      if ((data as any)?.debug || (data as any)?.payload) {
        try {
          const payload = (data as any).payload
          if (typeof window !== 'undefined') {
            // Save a copy for manual inspection/copying
            window.localStorage.setItem('ORDERS_GOOGLE_LAST_PAYLOAD', JSON.stringify(payload, null, 2))
            ;(window as any)._ORDERS_GOOGLE_LAST_PAYLOAD = payload
          }
          // Also log to console (trim large arrays if needed by the browser)
          // eslint-disable-next-line no-console
          console.log('[orders-google][DEBUG] payload preview (skipped Apps Script call):', payload)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[orders-google][DEBUG] failed to persist payload preview', e)
        }
      }
      return { success: true, message: 'OK', data: { sheetId: (data as any)?.sheetId } }
    } catch (e: any) {
      return { success: false, message: e?.message || 'Unknown error invoking edge function', data: { sheetId: undefined } }
    }
  }
}
