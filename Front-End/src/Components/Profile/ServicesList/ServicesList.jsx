
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import s from "./ServicesList.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "../../Index/Index.jsx";

export default function ServicesList ({openModal}) {

  console.log(openModal)
  const {user} = useAuth0();
  const userLog = useSelector(state => state.userLog);
  const role = user.user_role || userLog;

  const allServices = useSelector(state => state.allServices);
  const allContracts = useSelector(state => state.contracts);

  const [currentPage, setCurrentPage] = useState(1);
  let myServices = [];

  useEffect( () => {
    setCurrentPage(1);
  },[allServices])

  const index = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  if(role === "Admin" || role === "SuperAdmin"){
    myServices = allServices
  }else{
    
      const myContracts = allContracts.filter(contract => contract.User !== null).filter( contract => contract.User.id === parseInt(user.id)); //Busca los contratos que ha hecho el usuario
      const contractsSupplierId = myContracts.filter(contract => contract.User !== null).map( contract => contract.SupplierServiceId); //Busca el id del SupplierService de los contratos del usuario
      contractsSupplierId.forEach( service => {             //Compara los los contractSupplierId con cada servicio para obtener los servicios contratados por el usuario
        const aux = allServices.find( element => {
          return element.Suppliers.SupplierService.id === parseInt(service)
        })
        return myServices = [...myServices, aux]
      })
  }

  //PAginacion
  //Variables de paginacion
  const servicesPerPage = 5;
  let indexOfLastService = currentPage * servicesPerPage;
  let indexofFirstService = indexOfLastService - servicesPerPage;
  const currentServices = myServices.slice(   
    indexofFirstService,
    indexOfLastService
    );
  //paginacion

  return(
    <div>

      { role === "Admin" || role === "SuperAdmin" ? <div className={s.new}>
        <button className={s.button} onClick={() => openModal(true)}>Agregar nuevo servicio</button>
      </div>: null}

      {role === "Admin" ||
      role === "SuperAdmin" ?
      <h2>Lista de servicios</h2> :
      <h2>Lista de servicios contratados</h2>}

        {myServices.length > 0 ?
        <Index
        servicesPerPage={servicesPerPage}
        allServices={myServices.length}
        index={index}
        currentPage={currentPage}/>: null}
    
      {/* Poner Solo admin: */}
      <div className={s.container}>

        {myServices.length > 0 ? currentServices.map( element => {
            return <Link to={"/services/" + element.id}>
                      <div className={s.card}>
                        <div>
                            <b>Id: </b><span>{element.id}</span>
                          </div>
                          <div>
                            <b>Tipo de servicio: </b><span>{element.serviceType}</span>
                          </div>
                          <div>
                            <b>Categoría: </b><span>{element.Category.name}</span>
                          </div>
                      </div>
                    </Link>
        }): <h3>No has contratado servicios...</h3>}


      </div>

    </div>
  )
}