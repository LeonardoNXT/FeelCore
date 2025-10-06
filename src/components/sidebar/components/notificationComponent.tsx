import { Bell, RefreshCcw } from "lucide-react";
import { useNotificationApi } from "@/stores/notificationStore";
import AssignAlert from "./AssignAlert";

export default function NotificationBarComponent() {
  const { notifications, setNotifications } = useNotificationApi();
  const unread = notifications
    .filter((notification) => notification.status == "enviado")
    .sort(
      (eOne, eTwo) =>
        new Date(eTwo.createdAt).getTime() - new Date(eOne.createdAt).getTime()
    );
  const readed = notifications
    .filter((notifications) => notifications.status !== "enviado")
    .sort(
      (eOne, eTwo) =>
        new Date(eTwo.createdAt).getTime() - new Date(eOne.createdAt).getTime()
    );

  console.log("readed", readed);

  const refreshNotification = async () => {
    const response = await fetch("/api/notification/all", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setNotifications(data);
  };

  return (
    <div className="w-full h-full md:border-1 border-[#ebebeb] rounded-4xl px-4 py-4 overflow-y-scroll">
      <div className="flex justify-between gap-2 text-[#333]">
        <div className="flex gap-2 items-center">
          <Bell className="w-[20px] h-[20px]" />
          <p className=" text-2xl">Notificações</p>
        </div>
        <div className="px-2 py-2 shadow-inner shadow-[#a1a1a1] rounded-full">
          <RefreshCcw
            onClick={refreshNotification}
            className="hover:rotate-180 hover:text-[#6185c9] duration-300 text-[#444] cursor-pointer w-[20px] h-[20px]"
          />
        </div>
      </div>
      {notifications ? (
        <div className="text-[#444]">
          {unread.length > 0 && (
            <div className="px-2 py-2">
              {unread.map((notification, i) => (
                <AssignAlert
                  key={i}
                  notification={notification}
                  status="Não Lido"
                />
              ))}
            </div>
          )}
          {readed.length > 0 && (
            <div className="px-2 py-2">
              {readed.map((notification, i) => (
                <AssignAlert
                  key={i}
                  notification={notification}
                  status="Lido"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="top-1/2 left-1/2 absolute translate-[-50%] text-[#333]">
          Não há notificações.
        </div>
      )}
    </div>
  );
}
