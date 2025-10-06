import { useState } from "react";

export type ErrorAPI = {
  error: string;
  message: string;
};

export default function useSetError() {
  const [error, setError] = useState<ErrorAPI | null>(null);

  return { error, setError };
}
