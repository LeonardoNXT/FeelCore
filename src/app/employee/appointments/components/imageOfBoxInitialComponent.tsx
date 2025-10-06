import Image from "next/image";

type Props = {
  urlImage?: string;
  fallbackImage?: string;
};

export default function ImageOfBoxInitialComponent({
  urlImage,
  fallbackImage,
}: Props) {
  return (
    <div className=" bg-[#292929] text-[#333] border-1 rounded-full">
      {urlImage ? (
        <Image
          src={urlImage}
          width={35}
          height={35}
          alt="Imagem do paciente"
          className="rounded-full"
        />
      ) : (
        <div className="px-2 py-2 text-[#fff]">{fallbackImage}</div>
      )}
    </div>
  );
}
