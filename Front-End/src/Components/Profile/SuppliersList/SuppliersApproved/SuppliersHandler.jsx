/* import { useAuth0 } from "@auth0/auth0-react"; */
import { useState, useEffect } from "react";
/* import { useSelector } from "react-redux"; */
import s from './SuppliersHandler.module.css'

import Index from '../../../Index/Index.jsx';
import { Link } from "react-router-dom";

export default function SuppliersApproved ({suppliers}) {

 /*  const {user} = useAuth0(); */
 /*  const userLog = useSelector(state => state.userLog); */
 /*  const role = user.user_role || userLog; */

  const [currentPage, setCurrentPage] = useState(1);
  let mySuppliers = suppliers;

  console.log(suppliers, "SUPPLIERS")

  const suppliersPerPage = 5;
  let indexOfLastSupplier = currentPage * suppliersPerPage;
  let indexofFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = mySuppliers.slice(   
    indexofFirstSupplier,
    indexOfLastSupplier
    );

  useEffect( () => {
    setCurrentPage(1);
  },[suppliers])
    
  const index = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

/*   if(role === "Admin" || role === "SuperAdmin"){
    mySuppliers = suppliers
  }else{
    
      const myContracts = allContracts.filter( contract => contract.User.id === parseInt(user.id)); //Busca los contratos que ha hecho el usuario
      mySuppliers = myContracts.map( contract => contract.Supplier); //Busca el id del Supplier de los contratos del usuario
  } */

  return (

    <div>

     {/*  {role === "Admin" ||
      role === "SuperAdmin" ? <h2>Proveedores verificados</h2> :
      <h2>Proveedores que han trabajado para ti</h2>} */}

        <div>

        {mySuppliers.length > 0 ?
          <Index
          servicesPerPage={suppliersPerPage}
          allServices={mySuppliers.length}
          index={index}
          currentPage={currentPage}/>: null}

          {suppliers.length > 0 ? currentSuppliers.map( supplier => {
            return <Link to={"/suppliers/" + supplier.id}><div className={s.card}>
              <div>
                <b>Proveedor: </b>{supplier.name}
              </div>
              {/* <div>
                <b>Verificado: </b>{supplier.isAuthorized ? "Si" : "No"}
              </div> */}
            </div></Link>
          }): <h3>No hay proveedores por procesar</h3>}
        </div>

      </div>

  )
}