import { Sitio } from '@/types/types/typesSitio';

export const getSitios = async (): Promise<Sitio[]> => {
  const response = await fetch('/api/sitios');
  if (!response.ok) {
    throw new Error('Error al cargar los sitios');
  }
  return await response.json();
};

export const createSitio = async (sitio: Sitio): Promise<Sitio> => {
  const response = await fetch('/api/sitios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sitio),
  });

  if (!response.ok) {
    throw new Error('Error al crear el sitio');
  }

  return await response.json();
};

export const updateSitio = async (id: number, sitio: Sitio): Promise<Sitio> => {
  const response = await fetch(`/api/sitios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sitio),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el sitio');
  }

  return await response.json();
};

export const deleteSitio = async (id: number): Promise<void> => {
  const response = await fetch(`/api/sitios/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el sitio');
  }
};
