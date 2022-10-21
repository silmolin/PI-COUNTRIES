import {React, useEffect} from 'react';
import { useParams } from 'react-router';
import { getCountry } from '../actions'
import { useDispatch, useSelector } from 'react-redux';
import ActivityCard from './ActivityCard'
import styles from './CountryDetail.module.css'
import { Link } from 'react-router-dom';
import styles1 from './Button.module.css'

const CountryDetail = () => {
    
    const {countryId} = useParams();
    const dispatch = useDispatch();
    
    
    useEffect(() => {
        dispatch(getCountry(countryId));
      }, [dispatch, countryId]);

    const country = useSelector((state) => state.country)

    return (
        <div className={styles.background}>

            <div className={styles.backCaja}>
                <Link to='/home'>
                    <button className={styles.back}>VOLVER</button>
                </Link>
            </div>
        <div className={styles.detailsContainer}>
            <div className={styles.flex}>
                
            </div>
           <img src={country.flags} alt={country.name} className={`${styles.col} ${styles.countryImage}`}/>
           <div className={`${styles.col} ${styles.countryDetails}`}>
             <p className={styles.firstItem}><strong>PAÍS: </strong> {country.name}</p>
             <p><strong>CONTINENTE: </strong>{country.continent}</p>
             <p><strong>CAPITAL: </strong> {country.capital}</p>
             <p><strong>SUBREGIÓN: </strong> {country.subregion}</p>
             <p><strong>ÁREA:</strong> {country.area} km2</p>
             <p><strong>POBLACIÓN:</strong> {country.population} habitantes</p>
             
                <div className={styles.activities}>
                    <div className={styles.actContainer}>
                    {country.activities && country.activities.map((activity) => 
                    
                    <ActivityCard 
                        name={activity.name} 
                        difficulty={activity.difficulty}
                        duration={activity.duration}
                        season={activity.season} 
                    />)}
                    </div>
                </div>
            </div>  
        </div>
        </div>
    );
}

export default CountryDetail;
