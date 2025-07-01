import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 125 115"
        {...props}
    >
        <defs>
            <path
                id="arc"
                d="M 12.5,60 A 50 50 0 0 1 112.5,60"
                fill="none"
            />
        </defs>

        <text fontFamily="Space Grotesk, sans-serif" fontSize="22px" fontWeight="bold" letterSpacing="1.5">
            <textPath href="#arc" fill="#C875A4" >
                LUPRIN
            </textPath>
            <textPath href="#arc" startOffset="51%" fill="#47F8FF">
                TECH
            </textPath>
        </text>

        <g transform="translate(2.5, 5)">
            {/* Brain half (left) */}
            <path
                d="M60 45.62C52.44 45.62 45.51 41.35 40.59 35.19C34.93 28.18 29.35 29.58 24.89 35.19C19.7 41.77 18.23 50.47 22.84 57.27C27.53 64.21 31.33 69.82 31.33 76.84C31.33 87.52 24.93 96.34 32.76 101.4C40.83 106.61 50.84 103.11 60 100.2V45.62Z"
                fill="#C875A4"
            />
            <path
                d="M41.73 53.4C37.01 55.43 35.85 61.18 39.58 64.9C43.3 68.63 48.91 67.49 51.13 62.77"
                stroke="#3A333C" strokeWidth="2" fill="none" strokeLinecap="round"
            />
            <path
                d="M40.15 72.07C36.43 74.1 36.25 79.85 40.01 82.58C43.76 85.3 49.37 84.16 51.59 79.44"
                stroke="#3A333C" strokeWidth="2" fill="none" strokeLinecap="round"
            />
            <path
                d="M49.91 87.72C46.19 89.75 46.01 95.5 49.77 98.23C53.52 100.95 59.13 99.81 61.35 95.09"
                stroke="#3A333C" strokeWidth="2" fill="none" strokeLinecap="round"
            />
            <circle cx="28" cy="45" r="2" fill="#ECC0DC" />
            <circle cx="34" cy="53" r="1.5" fill="#ECC0DC" />
            <circle cx="48" cy="48" r="1.5" fill="#ECC0DC" />
            <circle cx="55" cy="55" r="2" fill="#ECC0DC" />
            <circle cx="29" cy="65" r="2.5" fill="#ECC0DC" />
            <circle cx="45" cy="69" r="1" fill="#ECC0DC" />
            <circle cx="34" cy="85" r="2.2" fill="#ECC0DC" />
            <circle cx="48" cy="91" r="1.8" fill="#ECC0DC" />
            <circle cx="58" cy="86" r="1.5" fill="#ECC0DC" />

            {/* Circuit half (right) */}
            <path
                d="M60 45.62V100.2C70.62 103.93 83.33 106.67 92.5 101.4C100.21 96.94 101.95 87.56 99.41 80.08L99.5 79.5C102.5 70 95 62.5 95 62.5L95.83 58.75C98.33 51.25 93.33 45.62 93.33 45.62H60Z"
                fill="#3A333C"
            />
            <path d="M64 50H80" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M64 56H85" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M64 62H80" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M64 68H85" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M64 74H80" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M64 80H85" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M64 86H80" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M64 92H85" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M85 56V92" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <path d="M80 50V74" stroke="#47F8FF" strokeWidth="2" fill="none" />
            <rect x="88" y="60" width="10" height="18" fill="#47F8FF" rx="1" />
            <path d="M88 62 H 86" stroke="#3A333C" strokeWidth="1" />
            <path d="M88 65 H 86" stroke="#3A333C" strokeWidth="1" />
            <path d="M88 68 H 86" stroke="#3A333C" strokeWidth="1" />
            <path d="M88 71 H 86" stroke="#3A333C" strokeWidth="1" />
            <path d="M88 74 H 86" stroke="#3A333C" strokeWidth="1" />
            
            <circle cx="72" cy="53" r="2" stroke="#47F8FF" strokeWidth="1.5" fill="#3A333C" />
            <circle cx="72" cy="71" r="2" stroke="#47F8FF" strokeWidth="1.5" fill="#3A333C" />
            <path d="M72 77 L 76 81 L 72 85 L 68 81 Z" fill="#47F8FF" />
        </g>
    </svg>
);
