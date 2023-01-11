import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { removeItem, getTotal,cartRestore  } from '../../actions'
import { CartItem } from '../CartItem/CartItemCard'
import s from './Cart.module.css'


export const Cart = () => {
  let dispatch = useDispatch()
let cart = useSelector((state) => state.cart)
let totalPrice = useSelector((state) => state.totalPrice)

React.useEffect(() => {
 dispatch(getTotal())
 if(!cart) { dispatch(cartRestore())}
}, [dispatch, cart])
const removeItems = (id) =>{ 
  dispatch(removeItem(id))
}



 
    const cartMap = cart.map((service) => { 


      return <CartItem
      name={service.serviceType} price={service.pricePerHour} description={service.description} removeItem={removeItems} id={service.id} amount={service.amount} suppliers={service.Suppliers} />})
 
     
 return (
 
  <div style={{height: "50rem"}}> 
   {cart.length > 0 ? 
   <div>
   <div className={`container-fluid d-flex flex-wrap ${s.contenedorItems}`}>
    {cartMap}

  
    </div>
    <div className='container-fluid' style={{paddingTop: "2rem"}}>
      <h2>Total: ${totalPrice} </h2>
      <NavLink to='/buy'><button type="button" class="btn btn-success">Pagar</button></NavLink>
      </div>
      </div>
     : ""} 
    {cart.length < 1 ?
    <div className={`container-fluid ${s.contenedor}`}>
    <div className={`container-fluid ${s.emptyCart}`}>
<h3>Tu carrito está vacio</h3>
 <p>¡Mirá todos los servicios que podés contratar!</p>
 <NavLink
          
            to="/"
          >
            <div>
              <button className='btn btn-primary'>Explorar servicios</button>
            </div>
          </NavLink>
    </div>
    </div>
    : ""
    }
  </div>
 )
  
}