import React from 'react'
//import { useForm } from 'react-hook-form'
import s from './FormServices.module.css'
import { useDispatch } from 'react-redux'
import { editService, getAllServices, getCategories, getServiceDetails, getSuppliers, postServices } from '../../actions'
import { useState } from 'react';
import  {useSelector} from 'react-redux';
import { useEffect } from 'react';

export const FormServices = ({typeForm, idElement, close}) => {

  //typeForm es una prop para definir de que es el form, editar o crear
  //idElement es el id del elemento que esta seleccionado

let dispatch = useDispatch()
const categories = useSelector(state => state.categories);
const suppliers = useSelector(state => state.suppliers);
    //const {register, handleSubmit, formState: {errors}} = useForm()

const inicialState = {
    name: "",
    price: 0,
    description: "",
    categories: "",
    suppliers:[],
    suppliersId: []
}

    useEffect(() => {
        dispatch(getCategories())
    },[dispatch]);

    useEffect(() => {
        dispatch(getSuppliers())
    },[dispatch]);

    
    const  onSubmit = (e) => {
      e.preventDefault();
      
      console.log(inputValues)
      const imageForm = document.getElementById('images');
      const formData = new FormData(imageForm);
      
       if(typeForm === "create") {
        dispatch(postServices(formData, inputValues))
        dispatch(getAllServices());
      } ;

       if(typeForm === "edit") {
        dispatch(editService(idElement, inputValues));
        dispatch(getServiceDetails(idElement));
      }

       setInputValues(inicialState);

    }

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
    };

    const priceValidator = (name, set) => {
        
      if( !/^\d*\.[0-9]{2}$/.test(name) /* ||  */){
        set(prev => {     
          return {
            ...prev,
            priceError: "Formato inválido. Ej: 1800.00"
          }    
        });
      } 
      else set( prev => {
        return {
          ...prev,
          priceError: ""
        }
      });
    };
    
    const validateSuppliers = (e) => {

        if(e.target.value === 'choose'){
          setError({
                   ...error,
                   [e.target.name]: `Selecciona al menos un proveedor de la lista`
               });
               
           } else {
               setError({
                   ...error,
                   [e.target.name]:''
                  })
                }   
                let supplierName = suppliers.filter(s => s.id.toString() === e.target.value)
       setSupplier(supplierName[0]);
       console.log(supplier) //ESto solo lo estoy declarando para que no rompa, hay que refactorizar
      };

    const handlerSupplierClick = (e) => {
     
        setInputValues({
          ...inputValues,
          suppliers: [...inputValues.suppliers, supplier],
          suppliersId: [...inputValues.suppliersId, supplier.id]
        })
        setSupplier({});
      };

    const validateCategories = (e) => {

        if(e.target.value === 'choose'){
          setError({
                   ...error,
                   [e.target.name]: `Selecciona una categoría`
                  });

           } else {
               setError({
                   ...error,
                   [e.target.name]:''
               })
           }   
        }

    const [supplier, setSupplier] = useState({});
    let [inputValues, setInputValues] = useState(inicialState);

    console.log(inputValues)

    const changeHandler = (e) => {
      setInputValues( prev => {
        return {
          ...prev,
          [e.target.name] : e.target.value
        }
      })
     // console.log(inputValues)
    }

    let [error, setError] = useState({
      nameError: "",
      descriptionError: "",
      priceError:""
    })
    
    console.log(error)

    return (
      <div className={s.container}>
        <button className={`${s.close} ${s.button}`} onClick={ () => { close(false)}}>X</button>
      <div className={`card ${s.form}`}>

     <form onSubmit={(e) =>{ 
      onSubmit(e);
      close("");
      }} className="row g-3" enctype="multipart/form-data" id='images' >

      <div className="col-9">
        <label for="inputName" className="form-label">Nombre del Servicio</label>
        <input name='name' value={inputValues.name} onChange={(e) => {
          changeHandler(e);
          nameValidator(e.target.value, setError)
          }} 
          className="form-control"
          type="text"></input>
          <br></br>
        {error.nameError && <span className={s.error}>{error.nameError}</span>}
      </div>

      <div className="col-3">
    <label for="inputDescription" className="form-label">Precio por hora</label>
    <input name='price' onChange={(e) => {
        changeHandler(e);
        priceValidator(e.target.value, setError)
    }} type='number' className="form-control" id="inputPrice" placeholder="" value={inputValues.price} /* {...register("description", {required:true})} */></input>
 <br></br>
        {error.priceError && <span className={s.error}>{error.priceError}</span>}
  </div>
  
  <div className="col-12">
    <label for="inputDescription" className="form-label">Descripción del servicio</label>
    <input name='description' onChange={(e) => changeHandler(e)} type="text" className="form-control" id="inputDescription" placeholder="" /* {...register("description", {required:true})} */></input>

  </div>

          <div className={s.selectItems}>

            <div className={`form-group ${s.select}`}>
            <label for="exampleFormControlSelect1">Categoría</label> 
                <select class="form-control" id="exampleFormControlSelect1" defaultValue='choose' name='categories'  focus='true' onChange={(e) => {
                    changeHandler(e);
                validateCategories(e);
                }}>
                <option value='choose'>Selecciona una categoría</option>
                {categories?.map((c) => (
                <option name={c.name} key={c.id} value={c.id}>{c.name}</option>
                ))}
                </select>
                <br></br>
        {error.categories && <span className={s.error}>{error.categories}</span>}
                
             </div>

             <div className={`form-group0 ${s.select}`} >
            <label for="exampleFormControlSelect1">Proveedores</label> 
           
                <select class="form-control" id="exampleFormControlSelect1"  defaultValue='choose' name='suppliers'  focus='true' onClick={(e)=> validateSuppliers(e)}>
                <option value='choose'>Selecciona un proveedor</option>
                {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
                ))}
                </select><input  class="btn btn-light" type='button' value='Agregar' onClick={(e) => handlerSupplierClick(e)}/>
                <br></br>
        {error.suppliers && <span className={s.error}>{error.suppliers}</span>}
                <p>Selecciona un proveedor y presiona el botón para agregarlo</p>
                    {inputValues.suppliers?.map(s => (
                    <p>{s.name}</p>
                    ))}
                
             </div>

             </div>

              <div className={`mb-3 ${s.select}`}>
                <label>Imagen Representativa</label>
                <input class="form-control form-control-sm" id="formFileSm" type="file" name='image'/>
             </div>

             
 
   <div className="col-md-12">
    <button type="submit" className="btn btn-primary" disabled= {
      error.name || inputValues.name === "" || inputValues.description === "" || inputValues.price === "" || error.suppliers || !inputValues.suppliers.length || inputValues.categories === "" || error.categories ? true : false
    }>Enviar</button>

  </div>


</form>


    </div>
    
    
    </div>
    )
}