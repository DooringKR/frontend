import React from "react";

interface AddressIconProps {
  isAddressEntered: boolean;
}

const AddressIcon: React.FC<AddressIconProps> = ({ isAddressEntered }) => {
  const fillColor = isAddressEntered ? "#364153" : "#66CA99";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path
        d="M8.94412 0.5H3.05588C1.78367 0.5 1.14756 0.5 0.853004 0.751574C0.597423 0.96986 0.46179 1.29731 0.488161 1.63238C0.518553 2.01855 0.968348 2.46835 1.86794 3.36794L4.81206 6.31206C5.22788 6.72788 5.43579 6.93579 5.67553 7.01369C5.88642 7.08221 6.11358 7.08221 6.32447 7.01369C6.56421 6.93579 6.77212 6.72788 7.18794 6.31206L10.1321 3.36794C11.0317 2.46835 11.4814 2.01855 11.5118 1.63238C11.5382 1.29731 11.4026 0.96986 11.147 0.751574C10.8524 0.5 10.2163 0.5 8.94412 0.5Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default AddressIcon;
