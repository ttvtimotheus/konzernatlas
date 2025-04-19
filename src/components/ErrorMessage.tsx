"use client";

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export default function ErrorMessage({
  title = "Fehler",
  message,
  retry
}: ErrorMessageProps) {
  return (
    <div className="error-container rounded-lg border border-red-800 bg-red-900/20 p-6">
      <h3 className="text-xl font-semibold mb-2 text-red-400">{title}</h3>
      <p className="mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md text-white font-medium transition-colors"
        >
          Erneut versuchen
        </button>
      )}
    </div>
  );
}
