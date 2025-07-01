import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 120 105"
        {...props}
    >
        <defs>
            <path
                id="arc"
                d="M 15,50 A 45 45 0 0 1 105,50"
                fill="none"
            />
            <clipPath id="circle-clip">
                <circle cx="60" cy="65" r="38" />
            </clipPath>
        </defs>

        <text fontFamily="Space Grotesk, sans-serif" fontSize="20px" fontWeight="bold" letterSpacing="1px">
            <textPath href="#arc" fill="#47F8FF">
                LUPRIN
            </textPath>
            <textPath href="#arc" startOffset="52%" fill="#FFB3E4">
                TECH
            </textPath>
        </text>

        <g clipPath="url(#circle-clip)">
            {/* Left side: Brain */}
            <rect x="22" y="27" width="38" height="76" fill="#C875A4" />
            <path d="M41 47 C 31 47, 31 67, 41 67 S 51 87, 41 87" stroke="#3A333C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M51 52 C 46 52, 46 62, 51 62 S 56 72, 51 72" stroke="#3A333C" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="35" cy="45" r="2" fill="#ECC0DC" />
            <circle cx="48" cy="82" r="2.5" fill="#ECC0DC" />
            <circle cx="33" cy="87" r="1.5" fill="#ECC0DC" />
            <circle cx="53" cy="93" r="1.5" fill="#ECC0DC" />

            {/* Right side: Circuit */}
            <rect x="60" y="27" width="38" height="76" fill="#3A333C" />
            <path d="M60 45 H 80 V 85" stroke="#47F8FF" strokeWidth="3" fill="none" />
            <path d="M70 37 h 20" stroke="#47F8FF" strokeWidth="2.5" fill="none" />
            <path d="M70 55 h 20" stroke="#47F8FF" strokeWidth="2.5" fill="none" />
            <path d="M70 65 h 20" stroke="#47F8FF" strokeWidth="2.5" fill="none" />
            <path d="M70 75 h 20" stroke="#47F8FF" strokeWidth="2.5" fill="none" />
            <path d="M70 95 h 20" stroke="#47F8FF" strokeWidth="2.5" fill="none" />
            <rect x="90" y="50" width="8" height="20" rx="1" fill="#47F8FF" />
            <circle cx="75" cy="88" r="3" fill="#47F8FF" />
        </g>
    </svg>
);
