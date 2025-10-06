import ImageOfBoxInitialComponent from "./imageOfBoxInitialComponent";

type Props = {
  title: string;
  icon: boolean;
  urlImage?: string;
  fallbackImage?: string;
};

export default function HeaderOfBoxInitialComponent({
  title,
  icon,
  urlImage,
  fallbackImage,
}: Props) {
  return (
    <div className="flex justify-between items-center px-2 py-2">
      <p className="text-[16px] text-[#646464] py-1 px-2 bg-[#161616] border-1 border-[#333] rounded-2xl">
        {title}
      </p>
      {icon ? (
        <ImageOfBoxInitialComponent
          fallbackImage={fallbackImage}
          urlImage={urlImage}
        />
      ) : null}
    </div>
  );
}
