import { createContext, useState,useEffect } from "react";
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
  const [total,setTotal]=useState(0)

  useEffect(()=>{
    const nuevoTotal=pedido.reduce((total,producto)=>(producto.precio*producto.cantidad)+total,0)
    setTotal(nuevoTotal)
  },[pedido])

  const ObtenerCategorias=async () => {
   try {
    
    const {data}=await clienteAxios(`/api/categorias`); 
    setCategorias(data.data);
    setCategoriaActual(data.data[0])
  } catch (error) {
    console.log(error);
   }
  }
  useEffect(() => {
    ObtenerCategorias()
  }, [])
  
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
    const productoActualizado = pedido.filter(
      (producto) => producto.id !== id)
      setPedido(productoActualizado)
      toast.success('Producto Eliminado')
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
        total
      }}
    >
      {children}
    </QuiscoContext.Provider>
  );
};
export { QuiscoProvider };
export default QuiscoContext;
