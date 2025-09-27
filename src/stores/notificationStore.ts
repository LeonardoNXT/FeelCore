import { create } from "zustand";

export interface ResponseNotification {
  _id: string;
  status: "enviado" | "lido";
  title: string;
  summary: string;
  organization: string;
  created_for: string;
  kind: string;
  notification_type: string;
  createdAt: string;
  updatedAt: string;
}
interface ApiResponse {
  total: number;
  unread: number;
  getAllAppointments: ResponseNotification[];
}

interface NotificationStore {
  notifications: ResponseNotification[];
  total: number;
  unread: number;
  setNotifications: (data: ApiResponse) => void;
  addNotification: (notification: ResponseNotification) => void;
  clearNotifications: () => void;
}

export const useNotificationApi = create<NotificationStore>((set) => ({
  notifications: [],
  total: 0,
  unread: 0,

  setNotifications: ({ getAllAppointments, total, unread }) =>
    set({ notifications: getAllAppointments, total, unread }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
      total: state.total + 1,
      unread: state.unread + (notification.status === "enviado" ? 1 : 0),
    })),

  clearNotifications: () => set({ notifications: [], total: 0, unread: 0 }),
}));
