type Props = {
  children: React.ReactNode;
  title: string;
  summary: string;
};

export default function BaseCreateBoxComponent({
  children,
  title,
  summary,
}: Props) {
  return (
    <div className="w-full py-2 px-2 bg-gradient-to-r from-[#000000] to-[#252525a1] border-1 border-[#333] rounded-4xl">
      <div className="p-2">
        <div className="px-2 py-1 rounded-full bg-[#1b1b1b] w-max text-[#646464] border-1 border-[#3d3d3d]">
          {title}
        </div>
        <div className="px-1 md:px-3 py-3 text-[#757575] text-[20px]">
          {summary}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
