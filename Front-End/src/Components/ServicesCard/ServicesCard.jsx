import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../../actions";
import s from "./ServicesCard.module.css";
import { Link } from "react-router-dom";
import { BsFillCartFill, BsFillCartCheckFill } from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";


export const ServicesCard = ({ name, price, description, id, image, disponible }) => {
  let dispatch = useDispatch();
  let cart = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useAuth0();
  const onClickBtn = () => {
    let verifier = (e) => e.id === id;
    if (cart.some(verifier)) return;
    dispatch(addCart(id));
  };

  const idCart = (element) => element.id === id;
  //  console.log(cart.some(idCart))

  return (
    <div>
      <div
        className={`card, ${s.general}`}
        style={{ maxWidth: "25rem", margin: "1rem" }}
      >
        <div className="card-body ">
          <Link to={"/services/" + id}>
            <img src={image} alt="" />
            <div className={s.contenedor}>
              <h2 className="card-title fs-4">{name}</h2>
            </div>
            <div className={s.contenedor}>
              <p className="card-text" style={{ color: "white" }}>
                ${price}/hr
              </p>
            </div>
          </Link>
          {!disponible?
           <div>
           <button className={s.buttonDisabled} disabled='true' onClick={onClickBtn}>No disponible</button>
         </div>
         :
         <div>
         {
          isAuthenticated && user.user_role !== "Supplier"? 
        cart.some(idCart) === false ? (
          <p
            className="btn btn-primary fs-2 align-self-end"
            onClick={onClickBtn}
          >
            <BsFillCartFill />
          </p>
        ) : (
          <p
            className="btn btn-primary fs-2 align-self-end"
            style={{ background: "green", cursor: "default" }}
          >
            <BsFillCartCheckFill />
          </p>
        )
      : null
      }</div>}
        </div>
      </div>
    </div>
  );
};
