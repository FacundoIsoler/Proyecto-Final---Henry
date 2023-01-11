
import { useAuth0 } from "@auth0/auth0-react";
/* import { useEffect, useState } from "react"; */
import { useDispatch, useSelector } from "react-redux";
/* import Index from '../../Index/Index.jsx'; */
import s from './SuppliersList.module.css';

import SuppliersHandler from "./SuppliersApproved/SuppliersHandler.jsx";
import { useEffect } from "react";
import { getSuppliers } from "../../../actions";

export default function SuppliersList () {

  const {user} = useAuth0();
  const userLog = useSelector(state => state.userLog);
  const role = user.user_role || userLog;

  const dispatch = useDispatch();
  
  useEffect( ( ) => {
    dispatch(getSuppliers());
  }, [dispatch])

/*   const suppliers = useSelector(state => state.suppliers) */

 /*  const [currentPage, setCurrentPage] = useState(1); */
  let mySuppliers = [];

  //Confing de paginacion
  const allSuppliers = useSelector(state => state.suppliers);
  const allContracts = useSelector(state => state.contracts);

  /* useEffect( () => {
    setCurrentPage(1);
  },[suppliers])
   */
  /* const index = (pageNumber) => {
    setCurrentPage(pageNumber)
  } */

  if(role === "Admin" || role === "SuperAdmin"){
    mySuppliers = allSuppliers
  }else{
    
      const myContracts = allContracts.filter(contract => contract.User !== null).filter( contract => contract.User.id === parseInt(user.id)); //Busca los contratos que ha hecho el usuario
      mySuppliers = myContracts.map( contract => contract.Supplier); //Busca el id del Supplier de los contratos del usuario
  }

  //Variables de paginacion
  /* const suppliersPerPage = 5;
  let indexOfLastSupplier = currentPage * suppliersPerPage;
  let indexofFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = mySuppliers.slice(   
    indexofFirstSupplier,
    indexOfLastSupplier
    ); */
  //paginacion

  //Separacion de proveedores en verificados y sin verificar
  const approvedSuppliers = mySuppliers.filter( supplier => supplier.isAuthorized)
  const suppliersPending = mySuppliers.filter( supplier => !supplier.isAuthorized)

  return (
    <div className={s.container}>  
      <div>
        { role === "Admin" || role === "SuperAdmin" ? <h2>Proveedores</h2> : <h2>Proveedores contratados</h2>}
{/* 
      {role === "Admin" ||
      role === "SuperAdmin" ? <h2>Listado de proveedores verificados</h2> :
      <h2>Proveedores que han trabajado para ti</h2>}
        <div>

        {mySuppliers.length > 0 ?
          <Index
          servicesPerPage={suppliersPerPage}
          allServices={mySuppliers.length}
          index={index}
          currentPage={currentPage}/>: null}

          {suppliers.length > 0 ? currentSuppliers.map( supplier => {
            return <div className={s.card}>
              <div>
                <b>Nombre del proveedor: </b>{supplier.name}
              </div>
              <div>
                <b>Verificado: </b>{supplier.isAuthorized ? "Si" : "No"}
              </div>
            </div>
          }): <h3>No hay proveedores disponibles</h3>}
        </div> */}
        <SuppliersHandler suppliers={approvedSuppliers} />
      </div>
      { role === "Admin" || role === "SuperAdmin" ? <div>
        <h2>Por aprobar</h2>
        <SuppliersHandler suppliers={suppliersPending} />

      {/* <div>

        {role === "Admin" ||
        role === "SuperAdmin" ? <h2>Listado de proveedores verificados</h2> :
        <h2>Proveedores que han trabajado para ti</h2>}
          <div>

          {mySuppliers.length > 0 ?
            <Index
            servicesPerPage={suppliersPerPage}
            allServices={mySuppliers.length}
            index={index}
            currentPage={currentPage}/>: null}

            {suppliers.length > 0 ? currentSuppliers.map( supplier => {
              return <div className={s.card}>
                <div>
                  <b>Nombre del proveedor: </b>{supplier.name}
                </div>
                <div>
                  <b>Verificado: </b>{supplier.isAuthorized ? "Si" : "No"}
                </div>
              </div>
            }): <h3>No hay proveedores disponibles</h3>}
          </div>

      </div> */}

      </div> : null}
    </div>
  )

}