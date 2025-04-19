"use client";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export default function Logo({ size = "medium" }: LogoProps) {
  const sizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };
  
  return (
    <div className={`relative ${sizes[size]}`}>
      <div className="absolute inset-0 bg-primary rounded-full opacity-50 animate-pulse" />
      <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-2/3 h-2/3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.5v-2.5H7l4-7v2.5h4l-4 7z" 
            fill="currentColor" 
            className="text-primary" 
          />
        </svg>
      </div>
    </div>
  );
}
