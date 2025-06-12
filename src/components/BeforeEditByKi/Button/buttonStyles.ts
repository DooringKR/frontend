interface ButtonStyleOptions {
  disabled?: boolean;
  selected?: boolean;
  loading?: boolean;
}

export function getButtonStyle({ disabled, selected, loading }: ButtonStyleOptions): string {
  if (disabled) {
    return "bg-gray-100 text-gray-300 cursor-not-allowed rounded-xl";
  }

  if (loading) {
    return "bg-brand-500 text-white rounded-xl";
  }

  if (selected) {
    return "bg-brand-500 text-white focus:ring-brand-200 hover:bg-brand-600 rounded-xl";
  }

  return "bg-gray-100 text-gray-800 focus:ring-gray-300 hover:bg-gray-200 rounded-xl";
}
