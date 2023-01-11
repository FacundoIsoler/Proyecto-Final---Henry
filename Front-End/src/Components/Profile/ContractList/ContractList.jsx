import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux"
import { getContracts } from "../../../actions";
import s from './ContractList.module.css';
import { useState } from "react";
import Index from '../../Index/Index.jsx';
import { Link } from 'react-router-dom';

export default function ContractList () {

  const dispatch = useDispatch();
  const {user} = useAuth0();

  const userLog = useSelector(state => state.userLog);
  const role = user.user_role || userLog;

  const allContracts = useSelector(state => state.contracts);
  const [currentPage, setCurrentPage] = useState(1);
  let myContracts;

  useEffect( () => {
    dispatch(getContracts())
  },[dispatch])

  useEffect( () => {
    setCurrentPage(1);
  },[allContracts])

  const index = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  
  if(role === "Admin" || role === "SuperAdmin"){
    myContracts = allContracts;
  }else{
    myContracts = allContracts.filter( contract => contract.User !== null).filter( contract => contract.User.id === parseInt(user.id));
  }

  //PAginacion
  //Variables de paginacion
  const contractsPerPage = 6;
  let indexOfLastContract = currentPage * contractsPerPage;
  let indexofFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = myContracts.slice(   
    indexofFirstContract,
    indexOfLastContract
    );
  //paginacion

  console.log(allContracts)

  return(
    <div>
      {role === "Admin" || role === "SuperAdmin" ? 
      <h2>Lista de contratos</h2>: 
      <h2>Lista de contratos realizados</h2>}

        {myContracts.length > 0 ? <Index
        servicesPerPage={contractsPerPage}
        allServices={myContracts.length}
        index={index}
        currentPage={currentPage}/>: null}

      <div className={s.container}>

        {myContracts.length > 0 ? currentContracts.map( contract => {

          return <Link to={`/profile/contract/${contract.id}`}><div className={s.card}>
            <div>
              <b>Id Contrato: </b><span>{contract.id}</span>
            </div>
            <div>
              <b>Proveedor: </b><span>{contract.Supplier.name}</span>
            </div>
            <div>
              <b>Cliente: </b><span>{contract.User ? contract.User.userName : null}</span>
            </div>  
            <div>
              <b>Fecha de creación: </b><span>{contract.date}</span>
            </div>
            <div>
              <b>Estado: </b><span>{contract.status}</span>
            </div>
          </div></Link> 
        }) : <div>
                <br/>
                <h3>No has realizado ningún pedido</h3>
              </div>  
                }

      </div>
    </div>
  )
}