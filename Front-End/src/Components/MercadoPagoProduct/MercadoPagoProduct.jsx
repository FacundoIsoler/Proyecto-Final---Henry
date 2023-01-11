import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { useAuth0 } from "@auth0/auth0-react";

// const FORM_ID = 'payment-form';
const BACKEND_SERVER =
  process.env.REACT_APP_BACKEND_SERVER || "http://localhost:3001";

export default function MercadoPagoProduct({ items }) {

  const cart = useSelector(state => state.cart)
  const [preferenceId, setPreferenceId] = useState(null);
  console.log(cart)

  const { user } = useAuth0();

  useEffect(() => {
    if (!preferenceId && cart) {
      // luego de montarse el componente, le pedimos al backend el preferenceId
      console.log("requesting preferenceid")
      axios.post(`${BACKEND_SERVER}/create_preference`, { items: cart, email: user.email }).then((order) => {

        console.log(`received! ${order.data.id}`)
        setPreferenceId(order.data.id);
        // const script = document.createElement('script');
        // script.type = 'text/javascript';
        // script.src =
        //   'https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js';
        // script.setAttribute('data-preference-id', preferenceId);
        // const form = document.getElementById(FORM_ID);
        // form.appendChild(script);
        const mp = new window.MercadoPago('TEST-959bcbcb-0bd9-475f-b5af-0349fcbf5bc8', {
          locale: 'es-AR'
        });

        mp.checkout({
          preference: {
            id: order.data.id
          },
          render: {
            container: '.cho-container',
            label: 'Pagar',
          }
        });
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferenceId, cart]);

  return (
    <div className='cho-container' />
  );
}