import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M21.64,6.36,12.87,1.87a2,2,0,0,0-1.74,0L2.36,6.36a2,2,0,0,0-1,1.73V15.91a2,2,0,0,0,1,1.73l8.77,4.49a2,2,0,0,0,1.74,0l8.77-4.49a2,2,0,0,0,1-1.73V8.09A2,2,0,0,0,21.64,6.36z M15,16h-5V9h2v5h3v2z" />
    </svg>
);
