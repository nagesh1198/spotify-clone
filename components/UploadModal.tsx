import useUploadModal from "@/hooks/useUploadModal";
import { useState } from "react";
import Input from "./Input";
import { useForm } from "react-hook-form";
import { Form } from "react-hook-form/dist/form";
import { FieldValues, SubmitHandler } from "react-hook-form/dist/types";
import Model from "./Model";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const useuploadmodal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { register, reset, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      useuploadmodal.onClose();
    }
  };
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }
      const uniqID = uniqid();

      //upload song

      const { data: songsData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (songError) {
        setIsLoading(false);
        return toast.error("Failed song upload");
      }
      //upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });
      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image upload");
      }

      const { error: supabaserrror } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songsData.path,
        });
      if (supabaserrror) {
        setIsLoading(false);
        return toast.error(supabaserrror.message);
      }

      router.refresh();
      setIsLoading(true);
      toast.success("Song created!");
      reset();
      useuploadmodal.onClose();
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Model
      title="Add a song"
      description="Uplaod a mp3 file"
      isOpen={useuploadmodal.isOpen}
      onchange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />

        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />

        <div className="pb-1">Select a song</div>
        <Input
          id="song"
          type="file"
          disabled={isLoading}
          accept=".mp3"
          {...register("song", { required: true })}
        />
        <div className="pb-1">Select an image</div>
        <Input
          id="image"
          type="file"
          disabled={isLoading}
          accept="image/*"
          {...register("image", { required: true })}
        />
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Model>
  );
};
export default UploadModal;
