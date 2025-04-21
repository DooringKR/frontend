export const getButtonStyle = (disabled?: boolean) => {
  if (disabled) return "bg-[#d9d9d9] text-[#b3b3b3] border border-[#b3b3b3] cursor-not-allowed";
  return "bg-[#2c2c2c] text-white";
};

export const getSizeClasses = (size: string) => {
  switch (size) {
    case "small":
      return "h-10 rounded-lg px-3 py-3 font-normal text-base text-center";
    case "large":
      return "h-10 rounded-lg px-3 py-3 font-normal text-base text-center";
  }
};
