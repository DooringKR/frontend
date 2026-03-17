export const ORDER_CONSTRUCT_GENERAL_FEE = 250_000;
export const ORDER_CONSTRUCT_RESERVED_FEE = 350_000;

export function getOrderConstructFee(orderConstruct: boolean | undefined, is_date_free: boolean): number {
  if (!orderConstruct) return 0;
  return is_date_free ? ORDER_CONSTRUCT_GENERAL_FEE : ORDER_CONSTRUCT_RESERVED_FEE;
}

export function formatOrderConstructFeeAmount(orderConstruct: boolean | undefined, is_date_free: boolean): string {
  const fee = getOrderConstructFee(orderConstruct, is_date_free);
  return fee > 0 ? `${fee.toLocaleString()}원` : "";
}
