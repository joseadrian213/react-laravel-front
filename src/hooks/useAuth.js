import { useEffect } from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";
export const useAuth = ({ middleware, url }) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  const navigate = useNavigate();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    clienteAxios("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw Error(error?.response?.data?.errors);
      })
  );

  //Segun lo que obtenga en el useSWR vamos a retornar un valor y el valor lo va a captar el useEffect que es el que hace la utenticacion segun el token y si no existe no dejara acceder al usuario
  useEffect(() => {
    if (middleware === "guest" && url && user) {
      navigate(url); //redirigimos al usuario al inicio
    }
    if (middleware === 'guest' && user && user.admin) {
      navigate('/admin'); 
    }
    //Verificamos si el usuario no es admin y si no es asi lo redireccionamos hacia el inicio 
    if (middleware === 'admin' && user && !user.admin) {
      navigate('/')
    }
    if (middleware === "auth" && error) {
      navigate("/auth/login");
    }
  }, [user, error]);

  const login = async (datos, setErrores) => {
    try {
      //Enviamos los datos como un objeto plano
      const { data } = await clienteAxios.post("/api/login", datos);
      localStorage.setItem("AUTH_TOKEN", data.token);
      setErrores([]);
      await mutate(); //Muatate revalida la informacion para verificar que el usuario ya se encuentra verificado
    } catch (error) {
      //Asi es como accedemos a los errores que obtenemos de laravel y podemos mostrarlos

      if (error.response.data.errors) {
        setErrores(Object.values(error.response.data.errors));
      }
    }
  };
  const registro =async  (datos,setErrores) => {

    try {
      //Enviamos los datos como un objeto plano       
      const {data}= await clienteAxios.post("/api/registro", datos);
      localStorage.setItem('AUTH_TOKEN',data.token);
      setErrores([])
      await mutate()
    } catch (error) {
      //Asi es como accedemos a los errores que obtenemos de laravel y podemos mostrarlos
      if (error.response.data.errors) {
        setErrores(Object.values(error.response.data.errors));
      }
    }

  };

  const logout = async () => {
    try {
      await clienteAxios.post('/api/logout',null,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      //eliminamos el localStorage cuando el usuario sale de la sesion 
      localStorage.removeItem('AUTH_TOKEN')
      await mutate(undefined);//Revalidamos de la cache para saber si el usuario ya salio de la sesion 
    } catch (error) {
      throw Error(error?.response?.data?.errors);
      
    }
  };

  return {
    login,
    registro,
    logout,
    user,
    error,
  };
};
