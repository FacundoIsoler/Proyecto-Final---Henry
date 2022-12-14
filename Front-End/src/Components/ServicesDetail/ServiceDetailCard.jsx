import React from "react";
import style from "./ServiceDetailCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../../actions";
import { useNavigate } from "react-router-dom";

export const ServiceDetailCard = ({ name, pph, description, category, suppliers, img, id, disponible }) => {
    
  let dispatch = useDispatch()
  let cart = useSelector((state) => state.cart)

  const navigate = useNavigate();

    const onClickBtn =() => {
     let verifier =(e) => e.id === id
     if(cart.some(verifier)) return;
     dispatch(addCart(id))
    } 

  return (
    <div className={style.container}>

      <button  className="btn btn-secondary"  onClick={() => navigate(-1)}>Regresar</button>

      <div className={style.container1}>
      <h2 className={style.name}>{name}</h2>
      <div className={style.container3}>
      <div className={style.container2}>
          <img className={style.img} src={img} alt="Imagen"/>
          {disponible?
          <button className={style.button} onClick={onClickBtn}>Agregar al Carrito</button>
          :
          <button className={style.buttonDisabled} disabled='true' onClick={onClickBtn}>No disponible</button>
        }
        </div>
        <div className={style.detail_container}>
          
          <h4>Costo por hora</h4> <p>${pph}</p>
          <h4>Descripción</h4>
          <p>{description}</p>
          <h4>Proveedores</h4>
        {suppliers.map(s => {
  return (
  <p>{s.name}</p>
  )
        })}
        </div>

      </div>

      </div>
    
      </div>

  );
};
