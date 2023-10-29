"use client"

import { song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast";

const useGetSongById=(id?:string)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [song,setSong]=useState<song|undefined>(undefined);
    const {supabaseClient}=useSessionContext();

    useEffect(()=>{
        if(!id){
            return;
        }

        setIsLoading(true);
        const fetchSong=async ()=>{
            const {data,error}=await supabaseClient
            .from('songs').select('*').eq('id',id).single();

            if(error){
                setIsLoading(false);
                return toast.error(error.message);

            }

            setSong(data as song);
            setIsLoading(false);

        }

        fetchSong();
    },[id,supabaseClient]);

    return useMemo(()=>({
        isLoading,
        song
    }),[isLoading,song])




};

export default useGetSongById;