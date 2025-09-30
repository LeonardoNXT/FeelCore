import { ResponseNotification } from "@/stores/notificationStore";

export default function AssignAlert({
  status,
  notification,
}: {
  status: string;
  notification: ResponseNotification;
}) {
  return (
    <div className="py-2 border-b-1 border-[#dadada]">
      <div className="flex justify-between items-center mb-2">
        <p className="tracking-widest text-[14px]">{status}</p>
        <p className="tracking-widest text-[14px]">
          {notification.createdAt.split("T")[0].split("-").reverse().join("/")}
        </p>
      </div>
      <p className="text-[#000] text-[20px] leading-[1]">
        {notification.title}
      </p>
      <div className="mb-2">
        <p className="tracking-widest leading-[1] mt-2">Resumo</p>
        <p>{notification.summary}</p>
      </div>
    </div>
  );
}
