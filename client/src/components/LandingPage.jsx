import React from "react";
import {Link} from 'react-router-dom'
import styles from './LandingPage.module.css'


function LandingPage(){
    return (
        <div className={styles.landing}>
            <h1 className={styles.titleLanding}>Countries Of The World</h1>
            <Link to='/home'>
                <div className={styles.center}>

                    <button className={styles.btn_landing}>Explorar</button>
                    
                </div>
            </Link>
        </div>
    )
}

export default LandingPage;