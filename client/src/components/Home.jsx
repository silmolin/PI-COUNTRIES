import React from "react";
import { useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {getCountries, filterByContinent, filterByActivity, getActivities, orderPopulation, orderName}  from '../actions'
import {Link} from 'react-router-dom'
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

    // Pagina actual 
    const [currentPage, setCurrentPage] = useState(1)
    // Cantidad de paises por pagina
    const [countriesPage, setCountriesPage] = useState(9)

    const [order, setOrder] = useState('')
    //Posicion del ultimo pais
    const LastCountry = currentPage * countriesPage
    //Posicion del primer pais
    const FirstCountry = LastCountry - countriesPage
    // Se divide el array de acuerdo a la cantidad de paises necesarios (9)
    const currentCountries = allCountries.slice(FirstCountry, LastCountry)

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

    // if(isLoading){
    //     return <div>Cargando...</div>
    // }

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

    function handleSort(event){
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

            
            <select onChange={event => handleSort(event)} className={styles.filtro}>
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
                { allActivities && allActivities.map(activity => (
                    <option value={activity.name} key={activity.id}>{activity.name}</option>
                ))} 
            </select>

            <div className={styles.centerr}>
            <button className={styles.refrescar} onClick={event => handleClick(event)}>Refrescar</button>
        </div> 
            
            </div> 
          

            {/* Se hace el map sobre el nuevo array de countries, para renderizar solo los 
            necesarios por pagina */}
            { isLoading ? <img src='../images/loading.gif' alt='Cargando...'/> :
            
            <div className={styles.cajaPaises}>

            {  currentCountries?.map(country => (
                <Link to={'/home/' + country.id}>
                    <CountryCard 
                    name={country.name} 
                    flags={country.flags} 
                    continent={country.continent}
                    id={country.id}
                    population={country.population}
                    key={country.id}/>
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