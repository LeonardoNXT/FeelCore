import { useState } from "react";

type FetchState = "completed" | "pending" | null;

type Cases = {
  null: string;
  pending: string;
  completed: string;
};
const functions = {
  stateButton(fetchState: FetchState, config: Cases) {
    if (fetchState === null) return config.null;
    return config[fetchState];
  },
};

export default function useButtonFetch() {
  const [fetchState, setFetchState] = useState<FetchState>(null);
  return { fetchState, setFetchState, ...functions };
}
