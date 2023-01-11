import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getServices } from '../../actions'
import s from './Services.module.css'



import { ServicesCard } from '../ServicesCard/ServicesCard'


export const Services = () => {
  let dispatch = useDispatch()
  let services = useSelector((state) =>state.services )
  console.log(services)

  React.useEffect(
    ()=>{
   
        dispatch(getServices())        
          


      }, [dispatch])

  const servicesMap = services.map((service) => { 
   
    return <ServicesCard
    name={service.serviceType} price={service.pricePerHour} description={service.description} id={service.CategoryId} img={service.representative_image} disponible={service.disponible} amount={service.amount}/>})

  return (
    <div className={s.contenedor}>
{servicesMap}

    </div>
  )
}
