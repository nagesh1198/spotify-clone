import { song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { use } from "react";

const useLoadImage=(song:song)=>{
const supabaseclient=useSupabaseClient();

if(!song){
    return null;
}

const {data:imageData}=supabaseclient
.storage.from('images')
.getPublicUrl(song.image_path);

return imageData.publicUrl;

}

export default useLoadImage;