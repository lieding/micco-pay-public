import * as React from "react";

function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      height="24"
      width="24"
      {...props}
    >
      <path
        fill="#7842EB"
        d="M8 0a5 5 0 00-5 5c0 5 5 11 5 11s5-6 5-11a5 5 0 00-5-5zm0 8a3 3 0 110-6 3 3 0 010 6z"
      />
    </svg>
  );
}

export default LocationIcon;