import { Sitio } from '@/types/types/Sitio';

const BASE_URL = 'http://localhost:3500/api/sitio';

export async function getSitios(): Promise<Sitio[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener sitios');
  return res.json();
}

export async function createSitio(sitio: Sitio): Promise<Sitio> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sitio),
  });
  if (!res.ok) throw new Error('Error al crear sitio');
  return res.json();
}

export async function updateSitio(id: number, sitio: Sitio): Promise<Sitio> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sitio),
  });
  if (!res.ok) throw new Error('Error al actualizar sitio');
  return res.json();
}

export async function deleteSitio(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar sitio');
}
