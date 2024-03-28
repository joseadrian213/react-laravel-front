import { useContext } from "react";
import QuiscoContext from "../context/QuioscoProvider";
//Cuando se crea un hook se declara como useHook enfatizando el inicio con "use" para que react lo integre de mejor manera como hook y le implemente ciertas mejoras 
const useQuiosco=() => {
    return useContext(QuiscoContext)
}
export default useQuiosco