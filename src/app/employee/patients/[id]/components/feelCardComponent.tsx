import { MoodDiaryEntry } from "./getMoodDiary";

export default function FeelCardComponent({ feel }: { feel: MoodDiaryEntry }) {
  return (
    <div className="min-w-[350px] w-full h-60 bg-gradient-to-tl from-[#fff] rounded-full px-4 py-4 flex justify-center flex-col items-center relative">
      <p className="text-[#64646493] absolute top-4 px-3 text-[14px] py-1 border-1 border-[#64646425] rounded-full">
        {new Date(feel.createdAt).toLocaleDateString()}
      </p>
      <p className="text-[#646464] text-2xl">{feel.emotion}</p>
      <p className="text-9xl bg-gradient-to-tr from-[#64646400] to-[#c7ab92] text-transparent bg-clip-text leading-[0.81]">
        {feel.intensity}
      </p>
    </div>
  );
}
