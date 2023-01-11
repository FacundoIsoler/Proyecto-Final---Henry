import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getServiceDetails } from "../../actions";
import { ServiceDetailCard } from './ServiceDetailCard.jsx'
import s from "./ServiceDetail.module.css";

export const ServicesDetail = () => {
  let dispatch = useDispatch();
  let serviceDetail = useSelector((state) => state.serviceDetails);
  let params = useParams();

  React.useEffect(() => {
    dispatch(getServiceDetails(params.d));
  }, [dispatch, params]);

   return (
    serviceDetail && serviceDetail.length > 0 ? <div className={s.container}>
      {/* <div className={style.rating}>
      <h2 className=""> Rating: </h2>
      <span>{params.id}</span>
      </div> */}
      
      <ServiceDetailCard
      
         name={serviceDetail[0].serviceType}
         pph={serviceDetail[0].pricePerHour}
        description={serviceDetail[0].description}
        id={serviceDetail[0].id}
        category={serviceDetail.Category}
        suppliers={serviceDetail[0].Suppliers}
        img={serviceDetail[0].representative_image}
        disponible={serviceDetail[0].disponible}
        params = {params.d}
      />
    </div> : null
  );
};
