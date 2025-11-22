export default function Logo({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "hsl(180, 75%, 40%)", stopOpacity: 1 }}
          />
          <stop
            offset="50%"
            style={{ stopColor: "hsl(25, 95%, 53%)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "hsl(220, 70%, 40%)", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" opacity="0.15" />

      <path
        d="M 32 14 Q 42 14 42 22 Q 42 28 32 30 Q 22 32 22 38 Q 22 44 32 44 Q 38 44 42 40"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M 40 15 C 40 11.7 37.3 9 34 9 C 30.7 9 28 11.7 28 15 C 28 18.5 34 26 34 26 C 34 26 40 18.5 40 15 Z"
        fill="url(#logoGradient)"
      />

      <circle cx="34" cy="15" r="2.5" fill="white" />
      <circle cx="18" cy="32" r="2" fill="hsl(180, 75%, 40%)" />
      <circle cx="46" cy="32" r="2" fill="hsl(220, 70%, 40%)" />
      <circle cx="32" cy="50" r="2" fill="hsl(25, 95%, 53%)" />
    </svg>
  );
}
