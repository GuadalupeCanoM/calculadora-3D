import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M21.64,6.36,12.87,1.87a2,2,0,0,0-1.74,0L2.36,6.36a2,2,0,0,0-1,1.73V15.91a2,2,0,0,0,1,1.73l8.77,4.49a2,2,0,0,0,1.74,0l8.77-4.49a2,2,0,0,0,1-1.73V8.09A2,2,0,0,0,21.64,6.36ZM12,3.11l8,4.45-3.5,1.79L12,5.11,7.5,7.35,4,5.56ZM4,15.36V8.64l4,2v5ZM12,13.11,8,11.11V8.89l4,2,4-2v2.22Zm8,2.25-4,2v-5l4-2Z" />
    </svg>
);
