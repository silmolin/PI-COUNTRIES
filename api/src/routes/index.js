const { Router } = require('express');
// Importar todos los routers;
const Sequelize = require('sequelize')
const axios = require('axios');

//Traemos las tablas de db
const { Country, Activity, country_activity} = require('../db.js');

// const Countries = require('./countries.js');

const router = Router();

// Configurar los routers
// router.use('/countries', Countries);

// Busco la data de la API


const countriesApi = async () => {
    const countriesUrl = await axios.get('https://restcountries.com/v3/all');
    
    const countries = await countriesUrl.data.map(country => {
        return{
            name: country.name.common,
            id: country.cca3,
            flags: country.flags[0],
            continent: country.continents[0],
            capital: country.capital != null ? country.capital : 'No se encontro capital',
            subregion: country.subregion,
            area: country.area,
            population: country.population
        }
        
    });
    return countries;
}


// Chequeo si esta completa la DB y sino la comleto:
const dbComplete = async () => {
    //consulta a la DB
    // console.log('Inicia consulta a DB')
    let countries = await Country.findAll();
    // console.log('Fin consulta a DB')

    //si la DB esta vacia cargo los datos
    if (countries.length === 0) {
        // solicitud a restcountries
        const arrCountries = await countriesApi();
        // console.log(' en /countries InfoCountries ejemplo 1: ', arrCountries[0])

        // Creating in bulk, creo los datos en masa.
        //https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#creating-in-bulk
        // console.log(' Inicia carga de DB con bulkCreate')
        await Country.bulkCreate(arrCountries);
        // console.log('Fin carga de DB con bulkCreate')
    }
};


router.get('/countries', async (req, res) => {
    const { name } = req.query;
    try {
        await dbComplete();
        // si viene un "name" por query
        if (name) {
            // console.log('Respuesta query con name');
            let result = await Country.findAll(
                {
                    where: {
                        name: {
                            [Sequelize.Op.iLike]: `%${name}%`,
                            //ver https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
                        }
                    }
                }
            );
            if (!result.length) {
                return res.status(400).send("No se encuentran paises para la busqueda")
            }
            return res.status(200).json(result)
        }

        //  actualizo el array con la consulta a la DB ya completa
        // console.log('Inicia consulta a DB completa')
        countryName = await Country.findAll({
            include: {
                model: Activity
            }
        });
        // console.log('Fin consulta a DB completa')
        res.status(200).send(countryName)

    } catch (error) {
        console.log(error);
    }
})



//A MI DB
/*const infoDB = async () => {
    try {
        return await Country.findAll({
            include: [{
                model: Activity,
                atributes: ['name'],
                throught: {
                    attributes: []
                }
            }]
        })
    } catch (e) {
        console.error(e)
    }
}

//UNO MIS DOS SOLICITUDES
const infoTotal = async () => {

    const apiData = await countriesApi();
    const dbData = await infoDB();

    const infoCompleta = dbData.concat(apiData)
    return infoCompleta
}



router.get('/countries', async(req, res)=>{
    const {name} = req.query

const total = await infoTotal ()
if(name){
    let countryName = await total.filter(e=> e.name.toLowerCase().includes(name.toLocaleLowerCase()))
    countryName.length ? res.status(200).send(countryName) : res.status(404).send('country not found')
} else{
    res.status(200).send(total)
}
})*/






//////////////////////////////////////

/*router.get('/countries', async (req,res) => {
    // Se traen todos los paises desde la API a la DB para utilizarlos desde ahi
    // Se almacenan solo los datos necesarios para la ruta principal 
    // Se obtiene un listado de los paises

    // Guardo en una constante lo que obtengo de la api
    const countries = await countriesApi()

    // Guardo el name pasado por query
    const queryName = req.query.name

    const queryOrder = req.query.order //esto rariii

    try{
        // Si la db esta llena no se hace nada
        let full = await Country.findAll({
            include: {
                model: Activity,
            }
        })
        // Si no hay datos, se crean
        if(!full.length){
            // bulkCreate busca los campos en el objeto y los pasa a la tabla
            // los datos del objeto para los que no hay campos en la tabla, no los guarda
            await Country.bulkCreate(countries)
        } 
    } catch (error){
        console.log(error) 
    }

    if(queryName){
        let countryName = await Country.findAll({
            where : {
                name: {
                    // Operador que busca coincidencias y no es case sensitive
                    //Si solo pongo queryName me toma la busqueda exacta
                    [Sequelize.Op.iLike] : `%${queryName}%`
                }
            }
        })
        countryName.length ?
        res.status(200).send(countryName) :
        res.status(404).send('No se encontro el pais')
    } else if(queryOrder){
        try {
        let country = await Country.findAll({
            // Trae hasta 9 paises
            // limit : 9,
            // Paginado - desde donde empieza a contar
            // offset: req.query.page,
            order : [['population', queryOrder]],
            include: {
                model: Activity,
            }
        })
        res.status(200).send(country)
        } catch (error) {
        res.status(500).send('Error')
        }
    } else {
        let full = await Country.findAll({
            include: {
                model: Activity
            }
        })
        res.status(200).send(full)
    }

})*/




























/////////////////////////////////////////////
router.get('/countries/:id', async (req,res) => {
    // Obtener el detalle de un país en particular
    // Debe traer solo los datos pedidos en la ruta de detalle de país
    // Incluir los datos de las actividades turísticas correspondientes

    const countryId = req.params.id //  cambie esto y chau!! no me andaba la del id

    let countryById = await Country.findByPk(countryId, {
        include : {
            model : Activity
        }
    })

    res.status(200).send(countryById)
})




router.get('/activity', async (req,res) => {
    try {
        let activities = await Activity.findAll()
        res.status(200).send(activities)
    } catch (errors) {
        res.status(500).send('Error')
    }
})




router.post('/activity', async (req,res) => {
    try{
        let {name, difficulty, duration, season, countries} = req.body
        // Se crea la actividad
        let newActivity = await Activity.create({
            name,
            difficulty,
            duration,
            season
        })

        // Reviso el array de paises para ver en cual se debe crear la actividad 
        countries.forEach(async (country) => {
            let activityCountry = await Country.findOne({
                where: {
                    name: country
                }
            }) 
            await newActivity.addCountry(activityCountry)
        });
        res.status(200).send('La actividad se creo exitosamente')
    } catch(error) {
        console.log(error)
        res.status(500).send('No se pudo crear la actividad')
    }
})



module.exports = router;
