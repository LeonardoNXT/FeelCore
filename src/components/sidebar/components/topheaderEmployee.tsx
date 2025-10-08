import Image from "next/image";
import { useNotificationApi } from "@/stores/notificationStore";
import { Menu, X } from "lucide-react";
import NotificationComponent from "./notificationSinoCoponent";
import { Employee } from "@/stores/userStore";
import { Dispatch, SetStateAction } from "react";
import { ErrorApi } from "@/types/ErrorApi";
import { getInitials } from "@/app/employee/appointments/components/getInitials";

interface Props {
  user: Employee;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setNotificationOpen: Dispatch<SetStateAction<boolean>>;
  notificationOpen: boolean;
  setError: Dispatch<SetStateAction<ErrorApi | null>>;
}

export default function TopHeaderEmployee({
  user,
  open,
  setOpen,
  setError,
  setNotificationOpen,
  notificationOpen,
}: Props) {
  const { notifications, unread, setNotifications } = useNotificationApi();
  const updateStatusNotification = async () => {
    let isUpdated = false;
    const unreadNotifications = notifications.filter(
      (notification) => notification.status === "enviado"
    );
    for (const notification of unreadNotifications) {
      const id = notification._id;
      try {
        const response = await fetch(`/api/notification/read/${id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Erro ao atualizar notificação");
        }
        isUpdated = true;
      } catch (err) {
        console.log(err);
        setError({
          error: "Houve um erro interno.",
          message: "Um erro interno ocorreu. Tente novamente erro.",
        });
      }
    }
    return isUpdated;
  };

  const updateNotification = async () => {
    try {
      const response = await fetch("/api/notification/all", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }
      setNotifications(data);
    } catch (err) {
      console.log(err);
      setError({
        error: "",
        message: "",
      });
    }
  };

  const refreshNotification = async () => {
    if (await updateStatusNotification()) {
      updateNotification();
    }
  };

  return (
    <div className="w-full max-w-[500px] md:bg-[#ffffff28] md:backdrop-blur-2xl rounded-full px-2 py-2 md:border-1 flex items-stretch justify-between relative z-10 top-4">
      <div className="flex bg-[#000] w-max px-2 py-2 rounded-full gap-2 items-center ">
        {user?.avatar?.url ? (
          <Image
            src={user.avatar.url}
            width={100}
            height={100}
            className="rounded-full w-[50px] border-2 border-[#dddddd]"
            alt="Sua imagem"
          />
        ) : (
          <div className="w-[50px] aspect-square rounded-full bg-[#333] border-3 border-[#97887a] flex justify-center items-center text-[#eee]">
            {getInitials(user.name)}
          </div>
        )}
        <div>
          <p className="pr-3 text-[14px] leading-[0.9] text-[#fff7ef]">
            Olá, {user.name.split(" ")[0]}
          </p>
          <p className="pr-3 text-[12px] text-[#727272]">Mostrar perfil</p>
        </div>
      </div>
      <div className="h-auto flex text-[#fff] border-1 rounded-full md:border-[0px]">
        <NotificationComponent
          open={open}
          unread={unread}
          setOpen={setOpen}
          setNotificationOpen={setNotificationOpen}
          notificationOpen={notificationOpen}
        />
        <div
          className="h-full aspect-square bg-[#181818] rounded-full flex justify-center items-center cursor-pointer hover:bg-[#000] duration-300"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X
              onClick={() => {
                setNotificationOpen(false);
                refreshNotification();
              }}
            />
          ) : (
            <Menu />
          )}
        </div>
      </div>
    </div>
  );
}
