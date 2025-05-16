import { EntregaMaterial } from '@/types/types/EntregaMaterial';

const API_URL = 'http://localhost:3500/api/entrega-material';

export const getEntregas = async (): Promise<EntregaMaterial[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener entregas');
  return res.json();
};

export const createEntrega = async (entrega: EntregaMaterial): Promise<EntregaMaterial> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entrega),
  });
  if (!res.ok) throw new Error('Error al crear entrega');
  return res.json();
};

export const updateEntrega = async (id: number, entrega: EntregaMaterial): Promise<EntregaMaterial> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entrega),
  });
  if (!res.ok) throw new Error('Error al actualizar entrega');
  return res.json();
};

export const deleteEntrega = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar entrega');
};
