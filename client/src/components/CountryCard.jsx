import React from "react";
import { Link } from "react-router-dom";
import styles from './CountryCard.module.css'

/* function CountryCard({flags,name,continent,id}){
    
    return (
        <div className={styles.card}>
            <div>
            <Link to={'/home/' + id}>
            <img src={flags} alt="imagen no encontrada" width='250px' height='125px' className={styles.countryImage}/>
            <h3 className={styles.name}>{name}</h3>
            <h5 className={styles.continente}>{continent}</h5>
           
            </Link>
            </div>
        </div>
    );
}

export default CountryCard;
 */

function CountryCard({flags,name,continent,id}){
    return (
        <div className={styles.card}>
            <div className={styles.banderaCardContainer}>
                <img  className={styles.banderaCardContainer}width='200px' height='125px' src={flags} alt="Imágen no disponible"/>
            </div>
            <div className={styles.detailsCard}>
                <h3 className={styles.tituloNombre}>{name}</h3>
                <h5 className={styles.tituloContinente}>{continent}</h5>
            </div>
            
            <Link to={'/home/' + id}>
                <button className={styles.botonCard}>Ver Más</button>
            </Link>
        </div>
);
}
export default CountryCard;

