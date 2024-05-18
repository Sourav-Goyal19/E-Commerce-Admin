import Image from "next/image";

interface AvatarProps {
  url: string;
}
const Avatar: React.FC<AvatarProps> = ({ url }) => {
  return (
    <>
      <Image
        src={url || "/default-avatar.jpeg"}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full object-contain cursor-pointer"
      />
    </>
  );
};

export default Avatar;
