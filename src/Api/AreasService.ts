import axiosInstance from "./../Api/axios"; 
interface Area {
  id: number;
  nombre: string; 

}

export const getAreas = async (): Promise<Area[]> => {
  const res = await axiosInstance.get("/areas");
  return res.data;
};

export const createArea = async (data: any): Promise<Area> => {
  const res = await axiosInstance.post("/areas", data);
  return res.data;
};

export const updateArea = async (id: number, data: any): Promise<Area> => {
  const res = await axiosInstance.put(`/areas/${id}`, data);
  return res.data;
};

export const deleteArea = async (id: number): Promise<void> => {
  const res = await axiosInstance.delete(`/areas/${id}`);
  return res.data;
};