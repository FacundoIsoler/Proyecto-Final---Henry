
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import style from "../Home/Home.module.css"

import { useAuth0 } from "@auth0/auth0-react";

import { getServices, getSuppliers, getUserDetails, searchingFalse, searchingServices, sendContractNotification } from '../../actions/index.js';

// import { Servicios } from '../../Mockup/Servicios.js';
import Index from '../Index/Index.jsx';
import { ServicesCard } from '../ServicesCard/ServicesCard.jsx';
// import { Footer } from '../Footer/Footer.jsx';
import NavFilters from '../Filters/NavFilters';
import Loading from '../Loading/Loading';
import Banner from '../Banner/banner';

export default function Home() {
  const dispatch = useDispatch();
  const { pathname } = useLocation()
React.useEffect(() => {
  window.scrollTo(-10, 0);
}, [pathname]);
  const loading = useSelector((state) => state.loading)
  const allServices = useSelector((state) => state.services)
  const searching = useSelector(state => state.searching);
  const [currentPage, setCurrentPage] = useState(1)
  // const [servicesPerPage, setServicesPerPage] = useState(9)
  const servicesPerPage = 9; // Volvemos a usarlo como estado cuando le demos funcionalidad
  const indexOfLastService = currentPage * servicesPerPage//3
  const indexOfFirstService = indexOfLastService - servicesPerPage//0
  const currentServices = allServices.slice(indexOfFirstService, indexOfLastService)

  const { user } = useAuth0();

  // const estadoLocalVacío = () => { setServicesPerPage() };

  // console.log(estadoLocalVacío);


  const index = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

   //Envio de mailing de notificación
   const location = useLocation()
   //console.log(location, "LOCATION")
   useEffect( () => {
   
   if(location.search.includes("success")){
     let status = location.search.split("&")
     .filter( (element) => element.includes("success"))
     .join().split("=");
     status = status[1];   //estado de la compra
 
     let email = location.search.split("&")
     .filter( (element) => element.includes("em"))
     .join().split("=");
     email = email[1];     //email del comprador
     
     dispatch(sendContractNotification(status,email))
   }
   // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [dispatch])
    //

  useEffect(() => {
    if(user) dispatch(getUserDetails(user.id, true));
    dispatch(getServices());
    dispatch(getSuppliers());
    dispatch(searchingServices()); //settea un estado global para que la barra de busqueda busque servicios
  }, [dispatch, user])

  useEffect(() => {
    setCurrentPage(1); //Cada vez que el estado cambie setea la pagina 1
  }, [allServices])



  return (
    <div className={style.general}>
      {
        !loading ?

          <div >
{/*carrusel*/}
<Banner />
        <div className={style.filter}>
          <div className={style.navTop}> 
          <span className={style.countServices}>Se encontraron {allServices.length} Servicios</span>
        <NavFilters index={index}></NavFilters>
        </div>
            {searching ?
              <button class="btn btn-secondary" onClick={() => {    /* renderiza un boton para volver a mostrar todos los servicios cuando se estan filtrando o usando la barra de busqueda */
                dispatch(getServices())
                dispatch(searchingFalse())
              }}>
                Volver a mostrar todos los servicios</button> : null}
        </div>
  


            {/* <div>servicios</div> */}
            <div className={style.cards}>
              {currentServices?.map(service => {
                
                return (
                  <ServicesCard id={service.id} name={service.serviceType} price={service.pricePerHour} description={service.description} image={service.representative_image} disponible={service.disponible} amount = {service.amount} key={service.id}
                  />
                )
              })}
            </div>

            <Index
              servicesPerPage={servicesPerPage}
              allServices={allServices.length}
              index={index}
              currentPage={currentPage}
            />

            {/* <Footer /> */}
          </div>
          :
          <Loading />
      }
    </div>


  )
}
