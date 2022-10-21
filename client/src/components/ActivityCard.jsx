import React from 'react';
import styles from './ActivityCard.module.css'

const ActivityCard = (activity) => {

    return (
        <div className={styles.card}>
            {activity && (
             
                <p key={activity.id}>
            <p><strong>Actividad: </strong>{activity.name}</p>
            <p><strong>Dificultad: </strong>{activity.difficulty}</p>
            <p><strong>Duracion: </strong>{activity.duration}</p>
            <p><strong>Temporada: </strong>{activity.season}</p>
            </p> 
            
            )  } 
            
        </div>
    );
};

export default ActivityCard;