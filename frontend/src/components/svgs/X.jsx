// const XSvg = (props) => (
//     <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
//         <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//     </svg>
// );
// export default XSvg;

// const UniEventsSvg = (props) => (
//     <svg width="250" height="100" viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg" {...props}>
//         <g fill="white" fontFamily="Arial, sans-serif" fontWeight="900">
//             <text x="10" y="40" fontSize="40" letterSpacing="3" transform="skewX(-10)">
//                 UNI
//             </text>
//             <text x="10" y="90" fontSize="40" letterSpacing="3" transform="skewX(-10)">
//                 EVENTS
//             </text>
//         </g>
//     </svg>
// );

// export default UniEventsSvg;
const CalendarSvg = (props) => (
    <div>
        <svg aria-hidden="true" viewBox="0 0 28 28" fill="black" {...props}>
            {/* White border with padding */}
            <rect x="1" y="1" width="26" height="26" rx="5" stroke="white" strokeWidth="2" fill="#3a3f45" />

            {/* Calendar body with padding inside */}
            <rect x="5" y="7" width="18" height="16" rx="2" stroke="white" strokeWidth="2" fill="#3a3f45" />

            {/* Calendar top bars */}
            <path d="M18 5V9" stroke="white" strokeWidth="2" />
            <path d="M10 5V9" stroke="white" strokeWidth="2" />

            {/* Calendar row separator */}
            <path d="M5 13H23" stroke="white" strokeWidth="2" />

            {/* Event dots */}
            <circle cx="10" cy="18" r="1.5" fill="#1DA1F2" />
            <circle cx="14" cy="18" r="1.5" fill="#1DA1F2" />
            <circle cx="18" cy="18" r="1.5" fill="#1DA1F2" />
        </svg>
    </div>
);

export default CalendarSvg;
