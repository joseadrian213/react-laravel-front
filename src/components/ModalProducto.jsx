import { useState,useEffect } from "react";
import useQuiosco from "../hooks/useQuiosco";
import { formatearDinero } from "../helpers";

export default function ModalProducto() {
  const { producto, handleClickModal,handleAgregarPedido,pedido } = useQuiosco();
  const [cantidad, setCantidad] = useState(1);
  const [edicion,setEdicion]=useState(false)

  useEffect(() => {
    //Con el useEffect detectamos si es que hay un cambio en el pedido 
    //Con el siguientee condicional verificamos si un elemento se encuentra dentro del pedido y si no es asi entonces lo agregamos  
    if (pedido.some(pedidoState => pedidoState.id===producto.id)) {//Con some vamos a comprobar sie el producto existe dentro del objeto 
      const productoEdicion=pedido.filter(pedidoState=>pedidoState.id===producto.id)[0] //filtramos el elemento que ya tenemos dentro del pedido y mostramos que ya lo tenemos 
      setCantidad(productoEdicion.cantidad)//Actualizamos la cantidad para saber cuanto tenemos dentro del pedido que se mostrara dentro del modal 
      setEdicion(true)
    }
  },[pedido])

  return (
    <div className="md:flex items-center gap-10">
      <div className="md:w-1/3">
        <img
          src={`/img/${producto.imagen}.jpg`}
          alt={`Imagen producto ${producto.nombre}`}
        />
      </div>
      <div className="md:w-2/3">
        <div className="flex justify-end ">
          <button onClick={handleClickModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-3xl font-bold mt-5">{producto.nombre}</h1>
        <p className="mt-5 font-black text-5xl text-amber-500">
          {formatearDinero(producto.precio)}
        </p>

        <div className="flex gap-4 mt-5">
          <button
          type="button"
          onClick={() => {
            if (cantidad <= 1) return 
            setCantidad(cantidad-1);
          }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <p className="text-3xl">{cantidad}</p>
          <button 
          type="button"
          onClick={() => {
            if (cantidad >= 5) return 
            setCantidad(cantidad+1);
          }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-800 px-5 py-2 mt-5 text-white font-bold uppercase rounded"
          onClick={() => {
            handleAgregarPedido({...producto,cantidad})//Agregamos el pedido
            handleClickModal()
          }}
        >
          {edicion?'Guardar Cambios':'Añadir al Pedido'}
        </button>
      </div>
    </div>
  );
}
