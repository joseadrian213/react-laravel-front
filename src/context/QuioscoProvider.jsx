import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { categorias as categoriasDB } from "../data/categorias";
import clienteAxios from "../config/axios";
const QuiscoContext = createContext();

const QuiscoProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState({});
  const [modal, setModal] = useState(false);
  const [producto, setProducto] = useState({});
  const [pedido, setPedido] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const nuevoTotal = pedido.reduce(
      (total, producto) => producto.precio * producto.cantidad + total,
      0
    );
    setTotal(nuevoTotal);
  }, [pedido]);

  const ObtenerCategorias = async () => {
    const token =localStorage.getItem('AUTH_TOKEN')
    try {
      const { data } = await clienteAxios(`/api/categorias`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setCategorias(data.data);
      setCategoriaActual(data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    ObtenerCategorias();
  }, []);

  const handleClickCategoria = (id) => {
    //Filtramos y obtenemos las categorias segun la opcion que seleccione el usuario obtenemos por el id
    const categoria = categorias.filter((categoria) => categoria.id === id)[0]; //tenemos que convertir el arreglo  aun objeto para poder pasarlo a categoria actual

    setCategoriaActual(categoria);
  };
  const handleClickModal = () => {
    setModal(!modal);
  };
  const handleSetProducto = (producto) => {
    setProducto(producto);
  };
  const handleAgregarPedido = ({ categoria_id, ...producto }) => {
    //Asi sacamos elementos con el destructuring

    if (pedido.some((pedidoState) => pedidoState.id === producto.id)) {
      //Con some vamos a comprobar si el producto existe dentro del objeto y no se añadan mas en el front
      const pedidoActualizado = pedido.map(
        //De esta forma actualizamos el producto si es que ya se encuentra en el arreglo tan solo actualizamos
        (pedidoState) =>
          pedidoState.id === producto.id ? producto : pedidoState
      );
      setPedido(pedidoActualizado);
      toast.success("Guardado Correctamente");
    } else {
      setPedido([...pedido, producto]);
      toast.success("Agregado el Pedido");
    }
  };
  const handleEditarCantidad = (id) => {
    const productoActualizar = pedido.filter(
      (producto) => producto.id === id
    )[0];
    setProducto(productoActualizar); //Pasamos el producto al modal
    setModal(!modal); //Motstramos el modal
  };
  const handleEliminarProductoPedido = (id) => {
    const productoActualizado = pedido.filter((producto) => producto.id !== id);
    setPedido(productoActualizado);
    toast.success("Producto Eliminado");
  };
  const handleSubmitNuevaOrden = async (logout) => {
    const token = localStorage.getItem("AUTH_TOKEN");

    try {
      const { data } = await clienteAxios.post(
        "/api/pedidos",
        {
          //En el siguiente objeto0 enviaremos los datos que necesitamos en laravel estos seran recogido por el request del metodo store
          total,
          //En pedido solo enviaremos los datos necesarios para laravel
          productos: pedido.map((producto) => {
            return {
              id: producto.id,
              cantidad: producto.cantidad,
            };
          }),
        },
        {
          //Peticion hacia la api
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      setTimeout(() => {
        setPedido([]);
      }, 1000);
      //Cerrar la sesion del usuario
      setTimeout(() => {
        localStorage.removeItem("AUTH_TOKEN");
        logout();
      }, 3000);
    } catch (error) {}
  };
  const handleClickCompletarPedido = async (id) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.put(`/api/pedidos/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickProductoAgotado = async (id) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      await clienteAxios.put(`/api/productos/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <QuiscoContext.Provider
      value={{
        categorias,
        categoriaActual,
        handleClickCategoria,
        modal,
        handleClickModal,
        producto,
        handleSetProducto,
        pedido,
        handleAgregarPedido,
        handleEditarCantidad,
        handleEliminarProductoPedido,
        total,
        handleSubmitNuevaOrden,
        handleClickCompletarPedido,
        handleClickProductoAgotado 
      }}
    >
      {children}
    </QuiscoContext.Provider>
  );
};
export { QuiscoProvider };
export default QuiscoContext;
