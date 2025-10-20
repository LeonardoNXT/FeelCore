import Image from "next/image";
import { getInitials } from "../../appointments/components/getInitials";
import { getTime } from "../../appointments/components/getTime";
import { MoveUpRight } from "lucide-react";
import MapComponentPadronized from "../../appointments/components/MapComponentPadronized";
import { Tasks } from "@/types/TasksReceive";
import { useRouter } from "next/navigation";

type Props = {
  tasks: Tasks[] | null;
};

export default function MapOfOtherTasksComponent({ tasks }: Props) {
  const router = useRouter();
  if (tasks) {
    return tasks.map((task, i) => (
      <MapComponentPadronized key={task._id} index={i} center>
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex justify-end px-4 py-4">
            {task.intendedFor.avatar ? (
              <Image
                src={task.intendedFor.avatar.url}
                width={40}
                height={40}
                alt="Imagem do paciente relacionado à tarefa."
                className="rounded-full border-1 border-[#c7bca2]"
              />
            ) : (
              <div className="h-[40px] w-[40px] rounded-full bg-[#333] text-[#eee] border-1 border-[#c7bca2]">
                {getInitials(task.intendedFor.name)}
              </div>
            )}
          </div>
          <div className="text-[#777] text-center py-8">
            {task.archive && (
              <div className="text-[#777] text-[14px] w-full flex justify-center gap-2">
                <p className="px-2 bg-[#eeeeee00] w-max border-1 border-[#bbb] rounded-[10px]">
                  {task.archive.archive_type.toLocaleUpperCase()}
                </p>
                <p>{new Date(task.completionDate).toLocaleDateString()}</p>
              </div>
            )}
            <div className="text-[#333] font-bold text-3xl md:text-5xl flex gap-2 ">
              {getTime(task.completionDate)}
              <p>X</p>
              {task.intendedFor.name.split(" ")[0]}
            </div>
            <p>{task.intendedFor.name}</p>
          </div>
          <div className="w-full pb-4 px-4 flex justify-end">
            <div
              className="w-[40px] h-[40px] shadow-inner shadow-[#333] rounded-full grid place-items-center text-[#333] p-2 hover:bg-[#fff] duration-300 cursor-pointer"
              onClick={() => {
                router.push(`/employee/tasks/${task._id}`);
              }}
            >
              <MoveUpRight className="w-full h-full duration-300 hover:rotate-45 " />
            </div>
          </div>
        </div>
      </MapComponentPadronized>
    ));
  }
}
