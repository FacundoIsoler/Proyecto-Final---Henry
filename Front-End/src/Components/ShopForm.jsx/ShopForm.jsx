import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";
import { getUserDetails, createContract} from '../../actions';
import MercadoPagoProduct from '../MercadoPagoProduct/MercadoPagoProduct';
import s from '../ShopForm.jsx/ShopForm.module.css'


export const ShopForm = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart)
  // console.log(cart)

  const { user } = useAuth0();

useEffect(()=> {
  if(user) dispatch(getUserDetails(user.id), true)
},[dispatch, user]);

  const userDetails = useSelector(state => state.userDetails)

  var inicialState = {};

  if(userDetails.length) {
    inicialState = {
      name: userDetails[0].name ? `${userDetails[0].name}` : '*',
      phone: userDetails[0].Detail?.phoneNumber? userDetails[0].Detail.phoneNumber : '*',
      email: userDetails[0].email? userDetails[0].email : '*',
      adress: userDetails[0].Detail?.adress? userDetails[0].Detail.adress : '*',
      location: userDetails[0].Detail?.location? userDetails[0].Detail.location : '*',
      CP: '',
      preferredTime:'Mañana (entre las 8:00 y las 12:00)'

  }
  } else {
    inicialState = {
      name: user.name? user.name : '*',
      phone: '*',
      email: user.email? user.email : '*',
      adress: '*',
      location: '*',
      CP: '',
      preferredTime:'Mañana (entre las 8:00 y las 12:00)'

  }
  }
 
    const [input, setInput] = useState(inicialState);
    const [pagar, setPagar] = useState(false);

    let [error, setError] = useState({
        nameError: "",
        lastnameError: "",
        emailError: "",
        phoneError: "",
        locationError: "",
        addressError: ""
      });

      useEffect(() => {
        return () => {
            setPagar(false);
            setInput(inicialState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[userDetails])

    // Funciones Validadoras
    function nameValidator (name, set) {
        if(!/^\S/m.test(name)){
          set(prev => {     
            return {
              ...prev,
              nameError: "Este campo no puede empezar con un espacio vacío"
            }    
          });
        }
        else if(!/\S$/gm.test(name)){
          set(prev => {     
            return {
              ...prev,
              nameError: "Este campo no puede terminar con un espacio en vacío"
            }    
          });
        }
        else if( /[^A-Za-zÑ-ñ- ]/.test(name) /* ||  */){
          set(prev => {     
            return {
              ...prev,
              nameError: "El nombre no puede contener carácteres especiales"
            }    
          });
        } 
        else set( prev => {
          return {
            ...prev,
            nameError: ""
          }
        });
      }
  
      function emptyValidator (name, set, event){
  
        if(!/^\S/m.test(name)){
          set(prev => {     
            return {
              ...prev,
              [event]: "Este campo no puede empezar con un espacio vacío"
            }    
          });
        }else if(event !== "addressError" && /[^A-Za-zÑ-ñ- ]/.test(name) /* ||  */){
          set(prev => {     
            return {
              ...prev,
              [event]: "Este campo no puede contener carácteres especiales"
            }    
          });
        } else set( prev => {
          return {
            ...prev,
            [event]: ""
          }
        });
  
      }

      function emailValidator(email, set){
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
          set(prev => {
            return {
              ...prev,
              emailError: "El email es invalido"
            }
          })
        } else set( prev => {
          return {
            ...prev,
            emailError: ""
          }
        });
      }
//
    const onChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }

    const handlerClick = (e) => {
      setInput({
        ...input,
        [e.target.name]:e.target.value
      });
    }
//
    const handlerSubmit = (e) => {
        e.preventDefault();
        setPagar(true);
   
        dispatch(createContract(user.id, input, cart));
    }

    //console.log("Rendering ShopForm");
    let i = 1;
    let total = 0;
  
    return (
<div className={s.background}>
        <div className={s.container}>
            <h2 className="h2">Finaliza tu Compra</h2>

            <div >
            <div className={s.itemsContainer}>
<br></br>
          <ul className={s.ul}>
            {cart.map(c => {
              return (
                <div>
                <li>
                <div className={s.order}><p class="mb-1">Ítem #{i}: </p><h6 class="mb-1"> {c.serviceType}</h6></div>
                  <div className={s.order}><p class="mb-1">Precio por Unidad: </p><h6 class="mb-1"> ${c.pricePerHour}</h6></div>
                  <div className={s.order}><p class="mb-1">Turnos reservados: </p><h6 class="mb-1"> {c.amount}</h6></div>
                  <div className={s.order}><p class="mb-1">Precio Total: </p><h6 class="mb-1"> ${c.pricePerHour*c.amount}</h6></div>
                  <p hidden='true'>{total = total + c.pricePerHour*c.amount}{i++}</p>
                  <div className={s.linea}></div>
                </li></div>
              )
            })}
            <h6 className={s.total}>Total: ${total}</h6>
          </ul>

            </div>
            <div className={s.linea}></div>

            <form onSubmit={(e) => e.preventDefault()} className="row g-3">

                <div class="form-group">
            <h3 className={s.text}>Datos del Comprador</h3>
                    <div div className="col-12">
                    <label className={s.text}>Nombre y Apellido:</label>
                    <input
                        type='text'
                        name='name'
                        class="form-control"
                        placeholder='*'
                        value={input.name}
                        onChange={(e) => {
                            onChange(e);
                            nameValidator(e.target.value, setError)}} />
                     <br></br>
                     {error.nameError && <span className={s.error}>{error.nameError}</span>}
                     </div>
                    
                  <div class="row">
            <div div class="col">
                    <label className={s.text}>E-mail: </label>
                    <input
                        type="email"
                        class="form-control"
                        name='email'
                        placeholder='*'
                        value={input.email}
                        onChange={(e) => {
                            onChange(e)
                            emailValidator(e.target.value, setError)
                            }}
                     />
                      {error.emailError && <span className={s.error}>{error.emailError}</span>}
                    </div>

                    <div div class="col">
                    <label className={s.text}>Número de Teléfono: </label>
                    <input
                        type='number'
                        name='phone'
                        class="form-control"
                        placeholder='*'
                        value={input.phone}
                        onChange={(e) => onChange(e)} />
                    
                    </div>
                    </div>
        <div className={s.linea}></div>
                    
                    <div className="col-12">
                    <h3 className={s.text}>Datos de entrega</h3>
                    <label className={s.text}>Dirección</label>
                    <input
                        type='text'
                        name='adress'
                        class="form-control"
                        placeholder='*'
                        value={input.adress}
                        onChange={(e) => {
                            onChange(e);
                            emptyValidator(e.target.value, setError, "addressError")
                        }} />
                        {error.addressError && <span className={s.error}>{error.addressError}</span>}
                    </div>
                  <div class="row">
                    <div className="col-9">
                    <label className={s.text}>Ciudad: </label>
                    <input
                        type='text'
                        name='location'
                        class="form-control"
                        placeholder='*'
                        value={input.location}
                        onChange={(e) => {
                            onChange(e);
                            emptyValidator(e.target.value, setError, "locationError")
                            }} />
                        {error.locationError && <span className={s.error}>{error.locationError}</span>}
                    </div>
                    
                    <div class="col-md-3">
                    <label className={s.text}>Código Postal: </label>
                    <input
                        type='number'
                        name='CP'
                        class="form-control"
                        placeholder='*'
                        value={input.CP}
                        onChange={(e) => onChange(e)} />
                    </div>
                    <div className={s.linea}></div>
</div>
                    <div className="col-12">
                    <h3 className={s.text}>Horario de Preferencia</h3>
                    <select class="form-control" name='preferredTime' onClick={(e) => handlerClick(e)}>
                    <option>Mañana (entre las 8:00 y las 12:00)</option>
                    <option>Siesta (entre las 12:00 y las 16:00)</option>
                    <option>Tarde (entre las 16:00 y las 20:00)</option>
                    </select>
                          
                </div>
<br></br>  <p className={s.msj}>*Son datos requeridos</p>
                    <div className="col-md-12">
                    <input
                        onClick={(e)=>handlerSubmit(e)}
                        className="btn btn-primary"
                        value='Solicitar Pago'
                        type='submit'
                        disabled= {
                            error.nameError || input.name === "*" || input.name === "" || error.emailError || input.email === "*" || input.email === ""|| error.locationError || input.location === "*" || input.location === ""||
                            error.addressError || input.adress === "*" || input.adress === ""|| error.phoneError || input.phone === "*" || input.phone === ""? true : false
                          }
                    />
                    <div>
                    {pagar? <MercadoPagoProduct/> : null}
                    </div>
                    
                    </div>

                </div>
                </form>

            </div>
        </div></div>
    )
}