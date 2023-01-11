import { useLayoutEffect } from "react";
import { useState } from "react";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate} from "react-router-dom";
import { deleteUser, getUserDetails, updateUser, updateImageProfile } from "../../../../actions";
import s from "./UserDetails.module.css";

import { useAuth0 } from "@auth0/auth0-react";

export default function UserDetails () {
  
  const dispatch = useDispatch();
  const location = useLocation();
  const query = location.search.split("=");
  const { user } = useAuth0();
  
  const details = useSelector(state => state.userDetails)

  const [inputs, setInputs] = useState({
    idModified: query[1],
    idPetitioner: user.id,
    userName: "",
    UserRolBody: "",
    name: "",
    age: "",
    eMail: "",
    adress: "",
    location: "",
    phoneNumber: "",
 
  })

  const userLog = useSelector(state => state.userLog)
  const role = user.user_role || userLog;

  console.log(role, "ROL")

  console.log(inputs, "PRIMER IMP")

  useLayoutEffect( ( ) => {       // useLayoutEffect => componentDidMount  
    dispatch(getUserDetails(query[1]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,query[1]])
  
  /* useEffect( () => {     // => NO, genera un loop infinito
    dispatch(getUserDetails(query[1]))
  },[]); */
  
  useEffect( () => {

    if(details.length > 0){
      setInputs( (prev) =>{
        return {
          ...prev,
          userName: details[0].userName,
          UserRolBody: details[0].UserRol.name,
          name: details[0].name,
          age: details[0].age,
          eMail: details[0].email,
          adress: details[0].Detail.adress,
          location: details[0].Detail.location,
          phoneNumber: details[0].Detail.phoneNumber
        }
      })
    }
  },[details])

  const navigate = useNavigate();
  const [noEditable, setNoEditable] = useState(true)

  const inputHandler = (e) =>{
    setInputs( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser(inputs));
    const imageForm = document.getElementById('images');
    const formData = new FormData(imageForm);
    dispatch(updateImageProfile(query[1],formData));
    navigate(-1);
  }

  const deleteHandler = (e) => {
    e.preventDefault();
    dispatch(deleteUser({
      idDelete: inputs.idModified,
      idPetitioner: inputs.idPetitioner}))
    navigate(-1);
  }



  return (
    <>
    {details.length > 0 ? <div className={s.container}>
      <div className={s.buttons}>
        <button className={s.returnButton} onClick={() => navigate(-1)}>Regresar</button>
        <div className={s.options} hidden={noEditable ? false : true}>
          
          {(role !== "SuperAdmin" && details[0].UserRol.name !== "SuperAdmin") ||
          (role === "SuperAdmin") ? 
          <button className={s.optionsButton} onClick={() => {
            setNoEditable( () => false)
          }}>Editar</button> : null}

          {(((details[0].UserRol.name !== "SuperAdmin") && 
          parseInt(user.id) !== details[0].id)) ||
          (role === "SuperAdmin" && details[0].id !== parseInt(user.id)) ? 
          <button className={s.optionsButton} onClick={(e) => deleteHandler(e)}>Eliminar usuario</button>
          : null}

        </div>
      </div>
      <form className={s.card} enctype="multipart/form-data" id='images' onSubmit={(e) => submitHandler(e)}>
        <div className={s.form}>
          <div className={s.data}>
            <div className={s.item}>
              <b>Id: </b><span>{details[0].id}</span>
            </div>
            <div className={s.item}>
              <b>Rol: </b><input name="UserRolBody" type="text" value ={inputs.UserRolBody} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
            <div className={s.item}>
              <b>UserName: </b><input name="userName" type="text" value ={inputs.userName} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
            <div className={s.item}>
              <b>Nombre: </b><input name="name" type="text" value ={inputs.name} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
            <div className={s.item}>
              <b>Edad: </b><input name="age" type="text" value ={inputs.age} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
            <div className={s.item}>
              <b>Correo: </b><input name ="eMail" type="text" value ={inputs.eMail} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
            <div className={s.item}>
              <b>Correo Verificado: </b><span>{details[0].eMail_verified ? "Si" : "No"}</span>
            </div>
            <div className={s.item}>
              <b>Dirección: </b><input name="adress" type="text" value={inputs.adress} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
            <div className={s.item}>
              <b>Provincia: </b><input name="location" type="text" value ={inputs.location} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
            <div className={s.item}>
              <b>Teléfono: </b><input name="phoneNumber" type="text" value ={inputs.phoneNumber} disabled={noEditable} onChange={(e) => inputHandler(e)}></input>
            </div>
          </div>
          <input type="submit" value="Enviar" hidden={noEditable ? true : false}/>
          <button className={s.optionsButton} hidden={noEditable ? true : false} onClick={() =>{
            setNoEditable(true)
            //dispatch
          }}>Cancelar</button>
        </div>
        <div className={s.picture}>
          <img src={details[0].picture} alt="user" />
          <br></br>
          <input class="form-control form-control-sm" id="formFileSm" type="file" name='image' hidden={noEditable ? true : false} />
        </div>
        
      </form>
    </div>: "PONER UN LOADING"}
    </>
  )
}