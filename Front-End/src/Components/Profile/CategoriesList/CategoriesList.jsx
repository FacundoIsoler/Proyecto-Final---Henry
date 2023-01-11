
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, getCategories } from '../../../actions';
import s from './CategoriesList.module.css';

export default function CategoriesList () {

  const categories = useSelector(state => state.categories);
  let categoriesList = categories.filter( category => category.name !== "Otra");
  const dispatch = useDispatch();
  
  const [input, setInput] = useState({
    category: "",
    editActive: false,
  });
  
  useLayoutEffect( () => {
    dispatch(getCategories());
  },[dispatch])

  const inputHandler = (e) => {
    setInput( prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const editHandler = (e) =>{
    e.preventDefault();
    setInput( prev => {
      return {
        ...prev,
        editActive: input.editActive ? false : true  
      }
    })
  }
  
  return (
    <div>
            {console.log("render")}
      <div className={s.container}>

        <div className={s.data}>
          { !input.editActive ? <button className={s.button} onClick={(e) => {
            editHandler(e);
          }}>Agregar nueva Categoria</button> : null}

          { input.editActive ? 
          <>
            <input name="category"
            value={input.category}
            type="text" onChange={(e) => inputHandler(e)}
            className={s.catInput}>
            </input>

            <button className={`${s.addButton} ${s.button}`} onClick={(e) => {
              let sendData = { newCategory: input.category}
              dispatch(addCategory(sendData))
              editHandler(e);
              alert("Se ha agregado la categoria")
              dispatch(getCategories())
            }}>Agregar</button>
          </> : null}

        </div>

        <div className={s.catList}>
          <h3 className={s.title}>Lista de categorias disponibles</h3>
          <ul className={s.list}>
            {categoriesList.length > 0 ? categoriesList.map( categorie => {
              return <li className={s.item}>{categorie.name}</li>
            }) : null}
          </ul>
        </div>

      </div>

    </div>
  )
}