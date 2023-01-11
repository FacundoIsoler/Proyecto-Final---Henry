import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart, addPriceCart, addAmount } from "../../actions";
import s from "./ServicesCard.module.css";
import { Link } from "react-router-dom";
import { BsFillCartFill, BsFillCartCheckFill } from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";


export const ServicesCard = ({ name, price, description, id, image, disponible, amount, key }) => {

  
  let dispatch = useDispatch();
  let cart = useSelector((state) => state.cart);
  const { user } = useAuth0();
  // let [serviceAmount, setServiceAmount] = React.useState(amount)

  const userLog = useSelector(state => state.userLog);
  let role;
  if(user) role = user.user_role || userLog;
  

  const onClickBtn = () => {  
    let verifier = (e) => e.id === id;
    if (cart.some(verifier)) return;
  dispatch(addPriceCart(price))
    dispatch(addCart(id));
    dispatch(addAmount(id, amount))
    
  };

  const idCart = (element) => element.id === id;



// console.log(serviceId)
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
         role !== "Supplier"? 
        cart.some(idCart) === false ? (
          <p
          data-bs-toggle="modal" data-bs-target="#staticBackdrop"
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
