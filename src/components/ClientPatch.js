'use client';
import { useEffect } from 'react';
export function ClientPatch(){
  useEffect(()=>{
    document.documentElement.dataset.clientPatch='ready';
  },[]);
  return null;
}
