import CardPadronizedComponent from "@/app/employee/appointments/components/cardPadronized";
import { Customer } from "@/stores/userStore";
import analisarEmocoes from "./getMoodDiary";
import FeelCardComponent from "./feelCardComponent";
import { Search } from "lucide-react";

type ConfigPage = {
  border_color: string;
};

export default function PatientMoodDiaryComponent({
  patient,
  CONFIG_PAGE,
}: {
  patient: Customer;
  CONFIG_PAGE: ConfigPage;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-4xl mt-2">
      <div className="flex flex-col w-full gap-2 md:flex-row">
        <CardPadronizedComponent
          title="Emoção mais vista"
          fontSize="text-6xl"
          borderColor={CONFIG_PAGE.border_color}
          to="#d3b094"
          mt={0}
          my={0}
          borderSize="4"
          arrayOfItems={
            analisarEmocoes(patient.mood_diary).mostFrequent.emotion.emotion
          }
        />
        <CardPadronizedComponent
          title="Quantidade de vezes vista"
          fontSize="text-6xl"
          to="#d3b094"
          borderColor={CONFIG_PAGE.border_color}
          mt={0}
          my={0}
          borderSize="4"
          arrayOfItems={
            analisarEmocoes(patient.mood_diary).mostFrequent.emotion.count
          }
        />
      </div>

      <div className="w-full pb-5 bg-gradient-to-tr from-[#fff] to-[#a8866a] rounded-4xl border-4 border-[#e4d2bf]">
        <div className="w-full py-5 pb-6 flex justify-center items-center relative">
          <div className="w-[60%] md:w-1/2 relative">
            <input
              type="text"
              placeholder="Procure por:"
              className=" px-3 py-2 w-full rounded-full text-[#fff] outline-2 outline-[#f1f1f069] duration-200 hover:"
            />
            <Search className="absolute top-1/2 translate-y-[-50%] right-3 text-[#ffffff91]" />
          </div>
        </div>
        <div className="w-full pt-0 px-4 pb-5 flex gap-4 overflow-y-scroll">
          {patient.mood_diary.map((feel) => (
            <FeelCardComponent feel={feel} key={feel._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
