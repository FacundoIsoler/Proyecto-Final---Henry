
import s from './ConfirmModal.module.css';

export default function ConfirmModal ({item, set, action}){

  return(
    <div>
      <div className={s.container}>
        <h4>¿Seguro que deseas eliminar este {item}?</h4>
        <div className={s.buttons}>
          <button className={s.button} onClick={(e) => action(e)}>Si</button>
          <button className={s.button} onClick={() => set("")}>No</button>
        </div>
      </div>
    </div>
  )
}