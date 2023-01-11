import React, {useState} from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";
import s from "./Profile.module.css";
import { getContracts, getUserDetails, updateImageProfile, getAllServices } from "../../actions";
import { useEffect } from "react";
import axios from "axios";
import SuppliersList from "./SuppliersList/SuppliersList";
import UsersList from "./UsersList/UserList";
import ContractList from "./ContractList/ContractList";
import ServicesList from "./ServicesList/ServicesList";
import CategoriesList from "./CategoriesList/CategoriesList";
import { FormServices } from "../FormServices/FormServices";


export default function Profile() {
  const { user, getIdTokenClaims} = useAuth0();
console.log(user)
  //! DEBEMOS CHEQUEAR ESTA PARTE. NO LE VEO MUCHO
  //! SENTIDO SI PODEMOS OBTENER LOS DATOS A TRAVES
  //! DE useAuth0 SIN USAR REDUX
  //! DA ERROR PORQUE LOS DATOS SE OBTIENEN
  //! DE FORMA ASINCRONA, Y MANDA UN GET /users/NaN

  const dispatch = useDispatch();
  //const userDB = useSelector(state => state.userDB)

 const [setApiResponse] = useState("");
 const [tag, setTag] = useState("Proveedores");

 const[modal, setModal] = useState(false);

 useEffect( () => {
  dispatch(getAllServices());
}, [dispatch, modal])

 // como getIdTokenClaims es asincrono, debemos usar useEffect para
 // manejarlo adecuadamente
 useEffect(() => {
   let isMounted = true; // esta montado el componente

   // tenemos que declarar una funcion asincrona dentro de useEffect
   const getClaims = async () => {
    // si no esta montado, salimos y esperamos a que monte
     if (!isMounted) return;

     // obtenemos claims
     const claims = await getIdTokenClaims();
    // dejo aca para que vean que contiene los datos de user y la token
    // que necesitamos para mandar al back
    console.log(claims)

    // mandamos un get al back de prueba
    // que chequea la token. manda 401 si no existe o no es valida
    const { data, error } = await axios.request( {
      url: `http://localhost:3001/users/test`,
      method: 'get',
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${claims.__raw}`,
        },
      }
    );

    // seteamos el state correspondiente
    setApiResponse(JSON.stringify(data ?? error));
   };

   // llamamos a getClaims que es asincrona
   getClaims();

   // al desmontar el componente, seteamos la variable
   return () => {
     isMounted = false;
   };
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [getIdTokenClaims]); // la unica dependencia es esta
 
 //const userAuthId = user.id.split('|');
 //const userId = parseInt(userAuthId[1]);
 const [flag, setFlag]  = useState(false);

/*useEffect(() => {
    dispatch(getUserById(userId));
},[dispatch, userId])
*/
/*const onClick = (e) => {
  setFlag(flag?false:true)
  console.log(flag)
};*/

useEffect( () => {
  dispatch(getContracts());
  dispatch(getUserDetails(user.id, true));
},[dispatch, user.id])

const userLog = useSelector(state => state.userLog);
const role = user.user_role || userLog;

const onSubmit = (e) => {
  e.preventDefault();
  const imageForm = document.getElementById('images');
  const formData = new FormData(imageForm)
  dispatch(updateImageProfile(user.id,formData))
  setFlag(false);
}

const tagHandler = (e) => {
    setTag( () => {
      return e.target.textContent
    })
}

  return (
    <div className={s.container}>
      
      <nav className={s.navBar}>
        <ul>
          <li value="Suppliers" onClick={ (e) => tagHandler(e)}>Proveedores</li>
          <li value="Services" onClick= { (e) => tagHandler(e)}>Servicios</li>
          <li value="Orders" onClick={ (e) => tagHandler(e)}>Ordenes de compra</li>
          {role === "Admin" ||
          role === "SuperAdmin" ?
          <>
            <li value="Users" onClick={ (e) => tagHandler(e)}>Usuarios</li>
            <li value="categories" onClick={ (e) => tagHandler(e)}>Categorias</li>
          </>
            : null}
        </ul>
      </nav>
      {/* {console.log(userDB)} */}
      
      <h2>Bienvenido {user.name}</h2>
      
      <div className={s.content}>

          <br />
        
          {/*userAuthId[0] === 'auth0'?
          <div>
            <img src={userDB.picture} alt="profile image" />
          <input className={s.button} type='button' onClick={(e) => onClick(e)}/>
          </div>
          :
          <img src={user.picture} alt="" />
      */} 
          {/*userAuthId[0] === 'auth0' && */flag ? 
        <div className={s.container1}>
          <form onSubmit={(e) => onSubmit(e)} class="row g-6" enctype="multipart/form-data" id='images' >
          <input class="form-control form-control-sm" id="formFileSm" type="file" name='image'/>
          <input type='submit' value='update'/>
          </form>
        </div>  
        : null
      }

        <div className={s.categories}>
          {tag === "Proveedores" ? <SuppliersList/> : null}
          {tag === "Servicios" ? <ServicesList openModal={setModal} /> : null}
          {tag === "Usuarios" ? <UsersList/> : null}
          {tag === "Ordenes de compra" ? <ContractList/> : null}
          {tag === "Categorias" ? <CategoriesList/> : null}
        </div>
      
        <div className={s.aside}>
          <img src={user.picture} alt="" />
         {/*  <h2>Te logueaste con exito </h2> */}
          <h2 className={s.rolTitle}>En este sitio sos:</h2>
          <p className={s.rol}>{role}</p>
          {/* <p><code style={{'fontSize': 'large'}}>{JSON.stringify(apiResponse)}</code></p> */}
          {/* <p style={{'fontSize': 'xx-large'}}>{apiResponse}</p> */}
          <div>Mi carrito</div>
          <button>
            <NavLink
              to="/cart"
              className={({ isActive }) => (isActive ? s.active : s.inactive)}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className={s.cart}
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </div>
            </NavLink>
          </button>
        </div>
      </div> 

      <div className={ modal ? s.modalOpen : s.modalClose }>

        <FormServices typeForm={"create"} close={setModal}></FormServices>

      </div>
    </div>
  );
}
