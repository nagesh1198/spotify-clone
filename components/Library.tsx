"use client";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { song } from "@/types";
import React from "react";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
 interface LibraryProps{
    songs:song[];
 }

const Library:React.FC<LibraryProps> = ({
    songs
}) => {
  const useauthModal = useAuthModal();
  const uploadmodal = useUploadModal();
  const { user } = useUser();
  const onplay=useOnPlay(songs);
  const onClick = () => {
    if (!user) {
      return useauthModal.onOpen();
    }
    return uploadmodal.onOpen();
  };
  return (
    <div className="flex flex-col">
      <div
        className="
            flex
            items-center
            justify-between
            px-5
            pt-4"
      >
        <div
          className="inline-flex
                items-center
                gap-x-2"
        >
          <TbPlaylist className="text-neutral-400" size={26} />
          <p
            className="text-neutral-400
                    font-medium
                    text-md
                    "
          >
            Your library
          </p>
        </div>
        <AiOutlinePlus
          size={20}
          onClick={onClick}
          className="text-neutral-400
                cursor-pointer
                hover:text-white
                transition"
        />
      </div>
      <div
        className="flex
            flex-col
            gap-y-2
            mt-4
            px-3"
      >
       {songs.map((item)=>(
        <MediaItem
        onClick={(id:string)=>onplay(id)}
        key={item.id}
        data={item}
        />
       ))}
      </div>
    </div>
  );
}
export default Library;
