import * as React from "react";

function FailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="#df1b41" height="16" width="16" {...props}>
      <path
        fill="currentColor"
        d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"
      />
      <path
        fill="currentColor"
        d="M10.5 4L8 6.5 5.5 4 4 5.5 6.5 8 4 10.5 5.5 12 8 9.5l2.5 2.5 1.5-1.5L9.5 8 12 5.5z"
      />
    </svg>
  );
}

export default FailIcon;