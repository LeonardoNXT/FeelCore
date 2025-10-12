import Image from "next/image";
import { getInitials } from "../../appointments/components/getInitials";
import { getTime } from "../../appointments/components/getTime";
import { MoveUpRight } from "lucide-react";
import MapComponentPadronized from "../../appointments/components/MapComponentPadronized";
import { Tasks } from "@/types/TasksReceive";
import { Dispatch, SetStateAction } from "react";

type Props = {
  tasks: Tasks[] | null;
  setPendingTaskSelected?: Dispatch<SetStateAction<Tasks | null>>;
  setCompleteTaskSelected?: Dispatch<SetStateAction<Tasks | null>>;
};

export default function MapOfOtherTasksComponent({
  tasks,
  setPendingTaskSelected,
  setCompleteTaskSelected,
}: Props) {
  if (tasks) {
    return tasks.map((task, i) => (
      <MapComponentPadronized key={i} index={i} center>
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
              <div className="text-[#777] text-[14px] w-full flex justify-center">
                <p className="px-2 bg-[#eeeeee00] w-max border-1 border-[#bbb] rounded-[10px]">
                  {task.archive.archive_type.toLocaleUpperCase()}
                </p>
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
                if (setPendingTaskSelected) {
                  setPendingTaskSelected(task);
                }
                if (setCompleteTaskSelected) {
                  setCompleteTaskSelected(task);
                }
                window.scrollTo({ top: 0 });
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
