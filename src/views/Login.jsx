import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <>
      <h1 className="text-4xl font-black">Iniciar Sesión</h1>
      <p>Para crear un pedido debes de iniciar sesión </p>
      <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
        <form action="">
         
            <div className="mb-4">
                <label
                 className="text-slate-800" 
                 htmlFor="email">
                Email:
                </label>
                <input
                 type="text"
                 id="email"
                 name="email"
                 className="mt-2 w-full block p-3 bg-gray-50"
                 placeholder="Tu Email"
                 />
            </div>
            <div className="mb-4">
                <label
                 className="text-slate-800" 
                 htmlFor="password">
                Password:
                </label>
                <input
                 type="password"
                 id="password"
                 name="password"
                 className="mt-2 w-full block p-3 bg-gray-50"
                 placeholder="Tu Password"
                 />
            </div>
        
            <input
             type="submit"
             value="Iniciar Sesión"
             className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
             />
        </form>
      </div>
      <nav className='mt-5'>
        <Link to="/auth/registro">¿No tienes cuenta? Crea una </Link>
      </nav>
    </>
  )
}
