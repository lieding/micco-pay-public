import * as React from "react";

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <ellipse cx="16" cy="16" rx="16" ry="16" transform="rotate(-180 16 16)" fill="white"/>
      <path d="M12 12L20 20" stroke="#1E0E62" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 12L12 20" stroke="#1E0E62" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default CloseIcon;