'use client'

import { useCallback, useEffect, useMemo, useState } from "react";

export default function Lista() {

  const [invited, setInvited] = useState<{ id: number, name: string, deleted_at?: string | null, created_at: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/confirm');
      const data = await response.json();
      setInvited(data);
      console.log(data);
    } catch {
      console.error('Problemas ao buscar lista de convidados confirmados.')
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const confirmedGuests = useMemo(() => {
    return invited.filter((g) => !g.deleted_at)
  }, [invited]);

  return (
    <div className='flex flex-col gap-6 p-4'>
      <p className="text-2xl text-center font-bold text-[#434634]">Confirmados</p>
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <p className="font-semibold">Total: {confirmedGuests.length}</p>
            <ul className="flex flex-col gap-1">
              {confirmedGuests.map((g) => (
                <li key={g.id} className="bg-white font-medium text-lg text-[#434634] rounded-md flex gap-4 items-center"><span className="text-sm p-2 px-4 border-r">{g.id}</span> {g.name}</li>
              ))}
            </ul>
            {confirmedGuests.length == 0 && (<p className="bg-white p-4 font-medium text-lg text-[#434634] rounded-md flex gap-4 items-center">Nenhum convidado ainda...</p>)}
          </>
        )}
      </div>
    </div>
  );
}