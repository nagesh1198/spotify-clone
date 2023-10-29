import { create } from "zustand";

interface PlayerStore{

    ids:string[];
    activtedId?:string;
    setId:(id:string)=>void;
    setIds:(ids:string[])=>void;
    reset:()=>void;
     

};
const usePlayer=create<PlayerStore>((set)=>({
    ids:[],
    activtedId:undefined,
    setId:(id:string)=>set({activtedId:id}),
    setIds:(ids:string[])=>set({ids:ids}),
    reset:()=>set({ids:[],activtedId:undefined})

}));
export default usePlayer;

