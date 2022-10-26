import axios from 'axios'

export const GET_COUNTRIES = 'GET_COUNTRIES';
export const GET_COUNTRY = 'GET_COUNTRY';
export const GET_BY_NAME = 'GET_BY_NAME';
export const GET_ACTIVITY = 'GET_ACTIVITY';
export const ORDER_BY_NAME = 'ORDER_BY_NAME';
export const FILTER_CONTINENT = 'FILTER_CONTINENT';
export const FILTER_ACTIVITY = 'FILTER_ACTIVITY'
export const POST_ACTIVITY = 'POST_ACTIVITY'


// cuando yo vaya a byscar los datos a mi backend, los traigo a redux, los almaceno y luego los muestro a traves de los componentes

// Conexion con el backend
export function getCountries(){ //rariii
    return async function(dispatch) { // esta fn recibe un dispatch y despacha uuna accion
        let json = await axios.get('http://localhost:3001/countries');
        return dispatch({
            type: 'GET_COUNTRIES',
            payload: json.data  // lo q devuelve el backEnd
        })
    }
}

/*export function getCountries(){
    return async function(dispatch){
        try {
            var json = await axios.get('http://localhost:3001/countries')
            console.log(json)
       return dispatch({
        type: "GET_COUNTRIES",
        payload: json.data
       })
       
        } catch (error) {
            alert(error)
        }
    }
}*/ 


export const getCountry = (id) => dispatch => {
    return fetch ("http://localhost:3001/countries/" + id)
    .then(response => response.json())
    .then(data => {
        dispatch({
            type: 'GET_COUNTRY', 
            payload: data });
    });
};

export function getActivities(){  
    return async function(dispatch){
        let json = await axios.get('http://localhost:3001/activity');
        return dispatch({
            type: 'GET_ACTIVITY',
            payload: json.data   
        })
    }
} 



export function postActivity(payload){
    return async function(dispatch){
        let json = await axios.post('http://localhost:3001/activity', payload); // dir + obj x body
        return json;
    }
}

export function getByName(name){
    return async function(dispatch){
        try {
            let json = await axios.get('http://localhost:3001/countries?name=' + name);
            return dispatch({
                type: 'GET_BY_NAME',
                payload: json.data
            })
        } catch (error) {
            alert('No se pudo encontrar el pais')
        }
    }
}

export function orderName(payload){
    return {
        type: 'ORDER_BY_NAME',
        payload
    }
} //problemas

export function filterByContinent(payload){
    return {
        type: 'FILTER_CONTINENT',
        payload
    }
}

export function filterByActivity(payload){
    return {
        type: 'FILTER_ACTIVITY',
        payload
    }
}

export function orderPopulation(payload){
    return{
        type: "ORDER_BY_POPULATION",
        payload
    }
} //problemas






// function paginado(data, page = 1){
//     let countriesPage = 9;
//     let currentPage = 1;
//     if (page > 1){
//         currentPage = page;
//     }
//     let totalPages = Math.ceil(data.length / countriesPage);
//     //Posicion del ultimo pais
//     const LastCountry = currentPage * countriesPage;
//     //Posicion del primer pais
//     const FirstCountry = LastCountry - countriesPage;
//     // Se divide el array de acuerdo a la cantidad de paises necesarios (9)
//     const currentCountries = data.slice(FirstCountry, LastCountry);
//     return {currentCountries, totalPages}
// }


// FILTRO P/ PAISES CON MENOS DE 30 MILLONES DE PERSONAS // CON MENOS DE CIERTOS HABITANTES

// EN LAS ACTIONS DE ASYNC AWAIT A PROMESAS

// COMO BORRAR LA ACTIVIDAD CREADA PR NOSOTRAS  ????  OK

// AGREGAR NUEVO INPUT EN FORM

// SEARCH BAR ---> BUSCAR X CONTINENTE.  ok ----

// TRAER NUEVO DATO Y MOSTRARLO EN CARD O DETALLE

// PASAR DE ASYN AWAY A PROMESAS  -- ES FACIL

// COMPONENTE DE CLASE A FUNCIONAL 

// RUTA PUT Y DELETE   --> OK


// HACERR UN BOTON Y PAGIINADO CON NEXT Y PREV

// METODOS DE SQUALIZE

// PREG X EL ARCHIVO DEL BUDA INDEX

// EL METODO TRIM

// AGREGAR UNA NUEVA PROP AL MODELO

// BOTON ON CLICK Y AL FILTRO ON CHANGE - UN BOTON Q TRAIGA LOS VIDEOS JUEGOS DEL 2016 EN ADELANTE

// PREG QUE ES REDUX

// metodo set,q lo uso..