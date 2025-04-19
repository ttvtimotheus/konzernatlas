"use client";

import { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export default function LoadingSpinner({ 
  size = 35, 
  color = "#00bcd4", 
  loading = true 
}: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center py-4">
      <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
