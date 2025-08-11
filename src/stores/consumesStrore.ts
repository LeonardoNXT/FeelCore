// stores/consumerStore.ts
import { create } from "zustand";
import { Consumer } from "@/types/ConsumersReceive";

interface ConsumerStore {
  consumer: Partial<Consumer>;
  setConsumer: (data: Partial<Consumer>) => void;
  resetConsumer: () => void;
}

export const useConsumerStore = create<ConsumerStore>((set) => ({
  consumer: {},
  setConsumer: (data) =>
    set((state) => ({
      consumer: {
        ...state.consumer,
        ...data,
      },
    })),
  resetConsumer: () => set({ consumer: {} }),
}));
