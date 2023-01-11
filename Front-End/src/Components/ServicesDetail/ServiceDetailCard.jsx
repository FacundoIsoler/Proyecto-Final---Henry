import React from "react";
import style from "./ServiceDetailCard.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart, deleteService } from "../../actions";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ConfirmModal from "../Modals/ConfirmModal";
import { FormServices } from "../FormServices/FormServices";

export const ServiceDetailCard = ({
  name,
  pph,
  description,
  category,
  suppliers,
  img,
  id,
  disponible,
  params,
}) => {
  let dispatch = useDispatch();
  let cart = useSelector((state) => state.cart);

  const [adminOption, setAdminOption] = useState("");

  const { user } = useAuth0();
  const userLog = useSelector((state) => state.userLog);
  let role;
  if (user) role = user.user_log || userLog;

  const navigate = useNavigate();

  const serviceDetails = useSelector((state) => state.serviceDetails);
  const serviceId = serviceDetails[0].id;
  const deleteHandler = (e) => {
    e.preventDefault();
    dispatch(deleteService(serviceId));
    navigate(-1);
  };

  const onClickBtn = () => {
    let verifier = (e) => e.id === id;
    if (cart.some(verifier)) return;
    dispatch(addCart(id));
  };

  // console.log(adminOption);
  // console.log(user.user_role)

  return (
    <div className={style.container}>
      <div className={style.container1}>
        <input
          type="button"
          className={style.goBack}
          onClick={() => navigate(-1)}
        />
        <h2 className={style.name}>{name}</h2>
        <div className={style.container3}>
          <div className={style.container2}>
            <img className={style.img} src={img} alt="Imagen" />
            {disponible && user?.user_role !== "Supplier" ? (
              <button className={style.button} onClick={onClickBtn}>
                Agregar al Carrito
              </button>
            ) : user?.user_role !== "Supplier" ? (
              <button
                className={style.buttonDisabled}
                disabled="true"
                onClick={onClickBtn}
              >
                No disponible
              </button>
            ) : null}
          </div>
          <div className={style.detail_container}>
            <h4>Costo por hora</h4> <p>${pph}</p>
            <h4>Descripción</h4>
            <p>{description}</p>
            <h4>Proveedores</h4>
            {suppliers.map((s) => {
              return <p>{s.name}</p>;
            })}
          </div>

          {role === "Admin" || role === "SuperAdmin" ? (
            <div className={style.adminTools}>
              <h4>Herramientas de Administrador</h4>
              <div className={style.adminButtons}>
                <button
                  className={style.button}
                  onClick={() => setAdminOption("edit")}
                >
                  Editar Servicio
                </button>
                <button
                  className={style.button}
                  onClick={() => setAdminOption("delete")}
                >
                  Eliminar Servicio
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className={adminOption ? style.modalOpen : style.modalClose}>
        {adminOption ? (
          <>
            <div>
              <button
                className={`${style.button} ${style.closeButton}`}
                onClick={() => setAdminOption("")}
              >
                X
              </button>
            </div>
            {adminOption === "delete" ? (
              <ConfirmModal
                item={"servicio"}
                set={setAdminOption}
                action={deleteHandler}
              />
            ) : null}
            {adminOption === "edit" ? (
              <FormServices
                typeForm={"edit"}
                idElement={params}
                close={setAdminOption}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};
