import { React, useState } from "react";
import { useDispatch } from "react-redux";
//import { useParams, useHistory } from 'react-router'
import { getByName } from "../actions";
import styles from './Nav.module.css'


export default function Nav() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  function handleInputChange(e) {
    e.preventDefault();
    setName(e.target.value);
  }
  console.log(name);

  //const history = useHistory();
  // const handleInputChange = (event) => {
  //     event.preventDefault();
  //     setName(event.target.value)
  // }

  //const searchText = useState('')

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     history.push("/?search=" + searchText);
  // }

  const handleClick = (event) => {
    event.preventDefault();
    // Name es mi estado local
    dispatch(getByName(name));
    setName('')
  };
  return (
    <form className={styles.searchContainer} onSubmit={(event) => handleClick(event)}>
      <div className={styles.searchBox}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Nombre del país"
        onChange={(e) => handleInputChange(e)}
      />
      <button className={styles.searchButton} type="submit">BUSCAR </button> 
      </div>
    </form>
  );
}




//busqueda 

/*export default function Nav({setCurrentPage}){
    const dispatch = useDispatch()
    const [name, setName] = useState('')

    function handleInputChange(e){
        e.preventDefault()
        setName(e.target.value)
    }
    function handleSubmit(e){
        e.preventDefault()
        dispatch(getByName(name))
        setName('')
        setCurrentPage(1)
    }
    return(
        <div >
            <input 
                
                type='text'
                value={name}
                onChange={(e) => handleInputChange(e)}
                placeholder='Search country...'/>
        
            <input 
                
                type='submit'
                value='Search' 
                onClick={(e) => handleSubmit(e)}/>
        </div>
    )
}*/