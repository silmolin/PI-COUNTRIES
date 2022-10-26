import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCountries, postActivity } from '../actions'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import styles from './CreateActivity.module.css'
import styles1 from './Button.module.css'

function validate(input) {
    let errors = {}

    if(!input.name){
        errors.name = ("Se requiere un nombre") }
       else if(input.name.length > 30){
        errors.name = ("El nombre es muy largo")     }   
    
    if(!input.difficulty){
        errors.difficulty = ("Se requiere poner una dificultad")
    }
    
    if(!input.duration){
        errors.duration =("Se requiere duracion") }
        else if(input.duration  > 24 || input.duration < 1){
     errors.duration = ("La duracion debe ser entre 1hs y 24hs")}
     
    if(!input.season){
        errors.season = ("Se requiere una temporada")
    }

   if(input.countries.length === 0){
        errors.countries = ("Se requiere al menos un país")
    }

    return errors
}
       

export default function CreateActivity() {
    const dispatch = useDispatch()
    const history = useHistory() //o navigate
    const countries = useSelector((state) => state.countries)
    const [errors, setErrors] = useState({})  // mii estado local p errores

    // Inputs 
    const [input, setInput] = useState({
        name: '',
        difficulty: '',
        duration: '',
        season:'',
        countries: []
    })


    useEffect(() => {
        dispatch(getCountries(/* 'ASC' */)) //fijarse eso
    }, [dispatch])
    
    console.log(input)

    //const [buttonActivated, setButtonActivated] = useState(false)

    // function validateName(value) {
    //     if(!/^[a-zA-Z]+$/.test(value)) {
    //       setErrors('El nombre solo debe contener letras');
    //     } else {
    //       setErrors('')
    //     }
    //     setInput(value)
    // }

    function handleChange(e){
        // Le agregamos el e.target.value (lo que vamos modificando) al input actual 
        e.preventDefault();
        /* setInput((prev) => ({ ...prev, [e.target.name]: e.target.value })); */
        setInput({
            ...input,
            [e.target.name] : e.target.value // a medida q voy escribiendo mi estado input va recibiendo y va guardando eso que escribo
        })
        console.log(input)
        
        setErrors(validate({ // seteo el estado local errors pasandole la fn VALIDATE
          ...input, // con el estado input y el e.target.name y e.target.value
          [e.target.name]: [e.target.value]
        }))
        console.log(input)

    }

    function handleCheck(e){
        if(e.target.checked){
            setInput({
                ...input, 
                [e.target.name] : e.target.value
            })
        }
         setErrors(validate({
             ...input, 
             /* [e.target.name] */ status: e.target.value  // aca modifique!!!!!!!!!!!!!
         }))
    }

    function handleSelect(e){   /// filtro paises
        e.preventDefault()
        setInput({
            ...input,
            // Concateno lo que ya habia en el array, con el nuevo value
            countries: [...new Set([...input.countries, e.target.value])]
        })
         setErrors(validate({
            ...input, 
            countries: [...input.countries, e.target.value]
         }))
    }



    function handleSubmit(e){
        if(!input.name || !input.difficulty || !input.duration || !input.season || input.countries < 1){
            e.preventDefault();
            alert('Complete todos los campos para poder continuar')
        } else {
            e.preventDefault();
            dispatch(postActivity(input));
            alert('Tu actividad ha sido creada exitosamente');
            // Para volver a la pantalla principal
            history.push('/home')
            // Reseteamos el input
            setInput({
                name: '',
                difficulty: '',
                duration: '',
                season:'',
                countries: []
            })
        }
         setErrors(validate({
             ...input, 
            [e.target.name] : e.target.value
         }))    
    }

    function handleDelete(e){
        setInput({
            ...input,
            //Se va a filtrar todo el array, devolviendo todos los paises que no coincidan con el seleccionado
            countries: input.countries.filter(country => country !== e)
        })
    }

   

  /*    if(input.name && input.difficulty && input.duration && input.season && input.countries){
         setButtonActivated(true)
     }
 */
    return (
        <div  className={styles.create}>
            <div>
            <Link to='/home'>
                <button className={styles.back}>Volver</button>
            </Link>
            </div>
            <h1 className={styles.title}>Crear Actividad Turística</h1>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.justify}>
                <div >


                <div className={styles.container}>
                    <label className={styles.label}>Nombre: </label>
                    <input type="text" value={input.name} name='name' onChange={handleChange} className={styles.input}/>
                    {errors.name && (<p>{errors.name}</p>)}
                </div>


                <div className={styles.container}>
                    <label className={styles.label}>Dificultad: </label>
                    <label>
                    <input type="radio" value='1' name='difficulty' onChange={(e) => handleCheck(e)}/>
                    1</label>
                    <label>
                    <input type="radio" value='2' name='difficulty' onChange={(e) => handleCheck(e)}/>
                    2</label>
                    <label>
                    <input type="radio" value='3' name='difficulty' onChange={(e) => handleCheck(e)}/>
                    3</label>
                    <label>
                    <input type="radio" value='4' name='difficulty' onChange={(e) => handleCheck(e)}/>
                    4</label>
                    <label>
                    <input type="radio" value='5' name='difficulty' onChange={(e) => handleCheck(e)}/>
                    5</label>
                </div>
                <div className={styles.container}>
                    <label className={styles.label}>Duracion: </label>
                    <input type="number" min="" max="24"  value={input.duration} name='duration' onChange={handleChange} className={styles.inputt}/>
                    {errors.duration && (<p>{errors.duration}</p>)}
                </div>
                <div className={styles.container}>
                    <label className={styles.labelRadio}>Temporada: </label>
                    <label>
                    <input type="radio" value='Verano' name='season' onChange={(e) => handleCheck(e)}/>
                    Verano</label>
                    <label>
                    <input type="radio" value='Primavera' name='season' onChange={(e) => handleCheck(e)}/>
                    Primavera</label>
                    <label>
                    <input type="radio" value='Otoño' name='season' onChange={(e) => handleCheck(e)}/>
                    Otoño</label>
                    <label>
                    <input type="radio" value='Invierno' name='season' onChange={(e) => handleCheck(e)}/>
                    Invierno</label>
                    {errors.season && (<p>{errors.season}</p>)}
                </div>

                <div className={styles.container}>
                    <label className={styles.label2}>Pais donde se realiza: </label>
                    <div >
                    <select onChange={(e) => handleSelect(e)} className={styles1.select}>
                    <option>Seleccionar pais</option>
                    {countries.map((country) => (
                        <option value={country.name} key={country.id}>{country.name}</option>
                    ))}
                    </select>
                    </div>
                    {errors.countries && (<p>{errors.countries}</p>)}
                </div>

                {input.countries.map((e) =>
                <div className={styles.countryContainer}>
                    <p className={styles.name}>{e}</p>
                    <button type='button' onClick={() => handleDelete(e)} className={styles1.back_delete}> X </button>
                </div>
                
                )}
                <div className={styles.center}>
                <button type='submit' className={styles.btn_submit}>Crear actividad</button>
                </div>
                </div>
            </form>
        </div>
    )
}