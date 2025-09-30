import { Bell } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function NotificationComponent({
  open,
  unread,
  setOpen,
  setNotificationOpen,
  notificationOpen,
}: {
  open: boolean;
  unread: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setNotificationOpen: Dispatch<SetStateAction<boolean>>;
  notificationOpen: boolean;
}) {
  return (
    <div
      onClick={() => {
        setOpen(true);
        setNotificationOpen(!notificationOpen);
      }}
      className={`bg-[#ffffff00] h-full flex justify-center items-center w-16 border-1 rounded-full transition-all duration-300 relative ${
        open
          ? "text-[#333] border-1 md:border-[#7284ac] border-[#5c869e]"
          : "text-[#ebebeb] md:border-[#ffffff] border-transparent"
      }`}
    >
      <Bell className={`${open ? "text-[#7a90c0]" : "text-[#ffffff]"}`} />
      {unread > 0 && (
        <div className="w-7 h-7 aspect-square bg-[#98b0ff] rounded-full absolute left-[-5px] bottom-[-5px] grid place-items-center">
          {unread}
        </div>
      )}
    </div>
  );
}
