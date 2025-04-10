import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios";

type CentroFormacion = {
  id: number;
  nombre:string;
  ubicacion:string;
  telefono:string;
  fecha_registro:string;
}

// Access the client
// const queryClient = useQueryClient()

// Queries
// const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

const getTodos = async () : Promise <CentroFormacion[]> => { 
  const {data} = await axios.get('localhost:3100/API/CentroFormacion');
  return data;
};

function reports({id, nombre, ubicacion, telefono, fecha_registro}: CentroFormacion) {
  const{ data, isLoading, isError } = useQuery({
    queryKey: ['todos'], 
    queryFn: getTodos,
  })

  if (isLoading) return <div>Loading...</div>
  // if (error instanceof isError) return <div>Error: {isError.message}</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
    <ul>
      {data?.map((user) => 
        <li key={user.id}>
          {user.id}
        </li>
        )}
    </ul>
    </>
  )
}

export default reports