import { getInitials } from "@/app/employee/appointments/components/getInitials";
import { Tasks } from "@/types/TasksReceive";
import Image from "next/image";
import VideoPlayer from "../../components/VideoPlayer";

export default function ContentOfResponseTask({ task }: { task: Tasks }) {
  if (task.content_of_response) {
    return (
      <div className="mt-4">
        <div className="px-1 py-1 border-1 rounded-full w-max border-[#3333333a] flex items-center pr-4 gap-2 text-[14px]">
          {task.intendedFor.avatar ? (
            <Image
              src={task.intendedFor.avatar.url}
              width={30}
              height={30}
              alt="Foto do paciente."
              className="rounded-full"
            />
          ) : (
            <div className="w-[30px] aspect-square bg-[#111] border-2 border-[#404233] rounded-full flex justify-center items-center">
              {getInitials(task.intendedFor.name)}
            </div>
          )}
          <p className="text-[#eee]">{task.intendedFor.name}</p>
        </div>
        <div className="mt-4 w-full flex flex-col">
          {task.content_of_response.archive && (
            <div className="mb-4 w-full">
              {task.content_of_response.archive.archive_type === "video" && (
                <VideoPlayer
                  src={task.content_of_response.archive.url}
                  title="Vídeo relacionado à tarefa."
                />
              )}
              {task.content_of_response.archive.archive_type === "image" && (
                <div className="w-full flex justify-center my-10">
                  <Image
                    src={task.content_of_response.archive.url}
                    width={500}
                    height={500}
                    alt="Imagem enviado do paciente"
                    className="w-max h-max rounded-3xl"
                  />
                </div>
              )}
            </div>
          )}
          <p className="text-[#eee] tracking-widest">Título da resposta</p>
          <p className="text-3xl text-[#fff] leading-[1]">
            {task.content_of_response.title}
          </p>
          <p className="text-[#eee] tracking-widest mt-4">Descrição</p>
          <p className="text-[#eee] text-justify">
            {task.content_of_response.description}
          </p>
        </div>
      </div>
    );
  }
}
