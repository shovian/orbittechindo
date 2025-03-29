'use client'
import { useRouter } from "next/navigation";
import { Button } from "./Button";

export default function BackButton(){
    const router = useRouter()
    return <><div><Button onClick={()=>{router.back()}}>{'<'}Back</Button></div></>
}