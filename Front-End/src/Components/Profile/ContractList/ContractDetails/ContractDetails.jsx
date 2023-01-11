
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getContractDetails } from '../../../../actions';
import s from './ContractDetails.module.css';

export default function ContractDetails () {

  const dispatch = useDispatch();
  const contract = useSelector(state => state.contractDetails)
  const params = useParams();

  useEffect( ( ) => {
      dispatch(getContractDetails(params.id))
  },[dispatch, params.id])

  return (
    <div className={s.container}>
      <div className={s.divv}>
        <div className={s.buttons}>
          <button>Back</button>
          <h3>Contrato # {contract.id}</h3>
          <p><b>Estado: </b>{contract.status}</p>
          <p><b>Actualizar</b></p>
          <select>
            
          </select>

        </div>
        <div className={s.text}>
          <p><b>Fecha: </b> {contract.date}</p>
          { contract.User ? <p><b>Cliente: </b>{contract.User.userName}</p> : null}
          { contract.Supplier ? <p><b>Proveedor: </b>{contract.Supplier.name}</p> : null}
        </div>
        <div className={s.reviews}>
          <h5>Review</h5>
          {/* <p><b>Puntiación</b>{contract.Review.rating}</p> */}
          <p><b>Comentario</b>{contract.commmet}</p>
        </div>
      </div>
    </div>
  )
}