import { create } from "zustand";

interface Login {
  name: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

type ReceiveContent = {
  login: Login;
  role: string;
};

interface LoginStore {
  receiveContent: ReceiveContent | null;
  setInitialLogin: (data: Partial<ReceiveContent>) => void;
  clearInitialLogin: () => void;
}

const useInitialLoginStore = create<LoginStore>((set) => ({
  receiveContent: null,

  setInitialLogin: (data) =>
    set((state) => ({
      receiveContent: {
        login: {
          name: data.login?.name ?? state.receiveContent?.login.name ?? "",
          avatar: data.login?.avatar ?? state.receiveContent?.login.avatar,
        },
        role: data.role ?? state.receiveContent?.role ?? "",
      },
    })),

  clearInitialLogin: () => set({ receiveContent: null }),
}));

export default useInitialLoginStore;
