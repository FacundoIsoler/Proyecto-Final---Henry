import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers, getUserDetails, searchingSuppliers } from "../../actions";
import style from "../Suppliers/Suppliers.module.css";
import Index from "../Index/Index.jsx";
import Loading from "../Loading/Loading";
import { searchingFalse } from "../../actions";
import { useAuth0 } from "@auth0/auth0-react";

import { SuppliersCard } from "../SuppliersCard/SuppliersCard";

export const Suppliers = () => {

  const loading = useSelector((state) => state.loading);
  let dispatch = useDispatch();
  let suppliers = useSelector((state) => state.suppliers);
  let [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth0();
  const userLog = useSelector(state => state.userLog);
  const role = user && user.user_role ? user.user_role : userLog;

  let suppliersAuth = suppliers.filter(element => element.isAuthorized) //Suppliers autorizados

  let suppliersList; // probablemente habra que pasarlo a un local state.

  if (user && (role === "Admin" || role === "SuperAdmin")) {
    suppliersList = suppliers;
  } else {
    suppliersList = suppliersAuth
  }

  //Variables de paginacion
  const suppliersPerPage = 9;
  let indexOfLastSupplier = currentPage * suppliersPerPage;
  let indexofFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = suppliersList.slice(
    indexofFirstSupplier,
    indexOfLastSupplier
  );
  const searching = useSelector((state) => state.searching);


  React.useEffect(() => {
    if(user) dispatch(getUserDetails(user.id), true);
    dispatch(getSuppliers());
    dispatch(searchingSuppliers());
  }, [dispatch, user]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [suppliers]);

  const index = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const suppliersMap = currentSuppliers.map((supplier) => {

    return !loading ? (
      <SuppliersCard
        name={supplier.name}
        cuit={supplier.cuit}
        description={supplier.description}
        id={supplier.id}
        details={supplier.Detail}
        logo={supplier.logo}
        rating={supplier.avgRating}
      />
    ) :
      <Loading />


  });

  return !loading ? (
    <div className={style.general}>

      {suppliersMap[0] ? <Index
        servicesPerPage={suppliersPerPage}
        allServices={suppliersList.length}
        index={index}
        currentPage={currentPage}
      /> : <Loading />}   {/* ACOMODAR ESTE MENSAJE */}

      {searching ? (
        <button
          class="btn btn-secondary"
          onClick={() => {
            /* renderiza un boton para volver a mostrar todos los servicios cuando se estan filtrando o usando la barra de busqueda */
            dispatch(getSuppliers());
            dispatch(searchingFalse());
          }}
        >
          Volver a mostrar todos los servicios
        </button>
      ) : null}

      <div className={style.container}>{suppliersMap}</div>

    </div>

  ) :
    <Loading />

};
