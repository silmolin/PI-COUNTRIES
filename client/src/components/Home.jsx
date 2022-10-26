import React from "react";
import { useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

import { getCountries, filterByContinent, filterByActivity, getActivities, orderPopulation, orderName }  from '../actions'

import CountryCard from './CountryCard'
import Paginado from "./Paginado"
import Nav from "./Nav";

import styles from './Home.module.css'


function Home(){
    const dispatch = useDispatch();

    // Lo mismo que hacer mapStateToProps // Solo retorna la parte del estado que me interesa
    const allCountries = useSelector((state) => state.countries)

    const allActivities = useSelector((state) => state.activities)


    

    // Mientras se cargan los paises
    const[isLoading, setIsLoading] = useState(true);

    
    const [currentPage, setCurrentPage] = useState(1) // Pagina actual - empieza en 1
    const [countriesPage, setCountriesPage] = useState(10) // Cantidad de paises por pagina
    const LastCountry = currentPage * countriesPage  //Posicion del ultimo pais
    
    if (LastCountry===10){
        var FirstCountry = 1;
    } else{
        FirstCountry = LastCountry - countriesPage//Posicion del primer pais
    }
    //const FirstCountry = LastCountry - countriesPage//Posicion del primer pais
    
    // Se divide el array de acuerdo a la cantidad de paises necesarios (10)
    const currentCountries = allCountries.slice(FirstCountry-1, LastCountry-1) // guarda los paises q voy a tener en cada pág // el slice agarra el arreglo y toma una porcion de acuerdo a lo que le paso x parametro, en este caso el indice del primer pais y el indice del ultimo pais

    const [order, setOrder] = useState('') // lo uso p el filto de ordenar x AZ y ZA

    const paginado = (totalPages)=>{
        setCurrentPage(totalPages);
    }


    // console.log(currentCountries)
    
    // const paginado = (pageNumber) => {
    //     setCurrentPage(pageNumber)
    // }

    // const prev = (event) => {
    //     event.preventDefault();
    //     if(currentPage <= 0){
    //         setCurrentPage(1)
    //     } else {
    //         setCurrentPage(currentPage - 9)
    //     }
    // }

    // const next = (event) => {
    //     event.preventDefault();
    //     if(currentCountries < 9){
    //         return;
    //     } else {
    //         setCurrentPage(currentPage + 9)
    //     }
    // }

    

    useEffect(() => {
        setIsLoading(true)
        dispatch(getCountries(),
        dispatch(getActivities()));
        setIsLoading(false)
    }, [dispatch, ]) //Si alguno de estos valores cambia, se vuelve a ejecutar

 

     const handleClick = (event) => {
        event.preventDefault();
        dispatch(getCountries())
     }

     function handleOrderPopulation(e){ //MAYOR O MENOR
        e.preventDefault();
        dispatch(orderPopulation(e.target.value))
        setCurrentPage(1)
        setOrder(`Ordenado ${e.target.value}`)
       }

    function handleSortByName(event){
        event.preventDefault();
        dispatch(orderName(event.target.value));
        setCurrentPage(1);
        setOrder(`Ordenado ${event.target.value}`)
    }

    function handleFilterContinent(event){
        // Se toma como payload el value de la option que elija el usuario
        event.preventDefault();
        dispatch(filterByContinent(event.target.value));
        setCurrentPage(1);
    }

    function handleFilterActivity(event){
        event.preventDefault()
        event.target.value === "none" ? dispatch(getCountries()):
        // Se toma como payload el value de la option que elija el usuario
        dispatch(filterByActivity(event.target.value))
        console.log(event.target.value)
    }

    return (
         <React.Fragment>
        <div className={styles.homeContainer}>
               
                <div className={styles.nav}>

                    <Link to='/'>
                    <button className={styles.title}>COUNTRIES</button>
                    </Link>
                    
                    <div className={styles.center}>
                        <Link to='/activity' className={styles.buttonAct} role="button">CREAR ACTIVIDAD</Link>
                    </div>

                    <Nav  setCurrentPage ={setCurrentPage}/>

                </div>    
        
        <div>
            <div className={styles.boxFiltrosYsearchBar}>
                
                <select onChange={(e)=> handleOrderPopulation(e)} className={styles.filtro}>
                    <option hidden value="all">Ordenar por poblacion</option>
                    <option value="low">Menor a Mayor</option>
                    <option value="high">Mayor a Menor</option>
                </select>

            
            <select onChange={event => handleSortByName(event)} className={styles.filtro}>
                {/** Deben ser filtrados ascendente y descendente por orden alfabetico y por cantidad de poblacion
                 */}
                <option hidden value="all">Ordenar por nombre</option> 
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
            </select>
            <select onChange={event => handleFilterContinent(event)} className={styles.filtro}>
                {/* filtrar por continente y por tipo de actividad turística */}
                <option value="All">Todos los Continentes</option>
                <option value="Africa">Africa</option>
                <option value="North America">America del Norte</option>
                <option value="South America">America del Sur</option>
                <option value="Antarctica">Antartica</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europa</option>
                <option value="Oceania">Oceania</option>
            </select>

            <select onChange={event => handleFilterActivity(event)} className={styles.filtro}>
                <option value="All">Todas las actividades </option>
                { allActivities.map(activity => (
                    <option value={activity.name} key={activity.id}>{activity.name}</option>
                ))} 
            </select>

            <div className={styles.centerr}>
            <button className={styles.refrescar} onClick={event => handleClick(event)}>Refrescar</button>
        </div> 
            
            </div> 
          

            {/* Se hace el map sobre el nuevo array de countries, para renderizar solo los 
            necesarios por pagina */}
            { isLoading ? <h1>Cargando...</h1> :
            
            <div className={styles.cajaPaises}>

            {  currentCountries?.map(country => (
                <Link to={'/home/' + country.id}>
                    <CountryCard 
                    name={country.name} 
                    flags={country.flags} 
                    continent={country.continent}
                    id={country.id}
                    population={country.population}
                    key={country.id}
                    />
                </Link>
            ))}
            </div>
            }
            
           
            <Paginado 
                countriesPage={countriesPage}
                allCountries={allCountries.length}
                paginado={paginado}
            />

            {/* <button onClick={(event) => {prev(event)}}
            disabled={currentPage <= 0 }>Prev</button>
            <button onClick={(event) => {next(event)}}
            disabled={currentCountries < 9 }>Next</button> */}

        </div>
        </div>
        </React.Fragment>
    )
    
}


export default Home;



/*      <header className={styles.titleContainer}> 
    </header>
*/