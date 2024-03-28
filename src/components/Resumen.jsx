import useQuiosco from "../hooks/useQuiosco"
import ResumenProducto from "./ResumenProducto"
import { formatearDinero } from "../helpers"
export default function Resumen() {
  const {pedido,total}=useQuiosco()
  const comprobarPedido=() => pedido.length===0
  return (
    <aside className="w-72 h-screen overflow-y-scroll p-5">
      <h1 className="text-4xl font-black">
        Mi Pedido 
      </h1>
      <p className="text-lg my-5">
        Aquí podrás ver el resumen y totales de tu pedido 
      </p>
      <div className="py-10">
      {pedido.length===0?(
        <p className="text-center text-2xl">
          No hay elementos en tu pedido aún 
        </p>
      ):(
        
          pedido.map(producto=>(
            <ResumenProducto 
            key={producto.id}
            producto={producto}
            />
          ))
        
      )}
      </div>
      <p className="text-xl mt-10">
        Total: {``}
        {formatearDinero(total)}
      </p>
      <form className="w-full">
        <div className="mt-5">
          <input 
          type="submit"
          className={` ${comprobarPedido() ? 'bg-indigo-100':'bg-indigo-600 hover:bg-indigo-800'}  cursor-pointer px-5 py-2 rounded uppercase font-bold text-white text-center w-full`}
          value="Confirmar Pedido"
          disabled={comprobarPedido()}
          />
        </div>
      </form>
    </aside>
  )
}
