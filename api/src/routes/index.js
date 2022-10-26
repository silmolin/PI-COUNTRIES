const { Router, response } = require('express');
// Importar todos los routers;
/* const Sequelize = require('sequelize') */ const {Op} = require('sequelize');
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
            flags: country.flags[1],
            continent: country.continents[0],
            //capital: country.capital != null ? country.capital : 'No se encontro capital',
            capital: country.capital ? country.capital : 'No se encontro la capital',
            subregion: country.subregion,
            area: country.area,
            population: country.population,
            //timezones: country.timezones,
        }
        
    });
    return countries;
}  
 

/* const countriesApi = async() =>{
    try {
        axios.get('https://restcountries.com/v3/all')
        .then((response)=> {
            response.data.map((country)=>{
                const countries = {
                name: country.name.common,
                id: country.cca3,
                flags: country.flags[0],
                continent: country.continents[0],
                capital: country.capital != null ? country.capital : 'No se encontro capital',
                subregion: country.subregion != null ? country.subregion : 'No se encontro subregion',
                area: country.area,
                population: country.population
                }
                return countries
            })
        })
        
    } catch (error) {
        console.log(error)
    }
    } */

    
// Chequeo si esta completa la DB y sino la comleto:
const dbComplete = async () => {
    //consulta a la DB
    let countries = await Country.findAll();
    
    //si la DB esta vacia cargo los datos
    if ( countries.length === 0) {
        // solicitud a restcountries
        const arrCountries = await countriesApi();
        // Creating in bulk, creo los datos en masa.
                await Country.bulkCreate(arrCountries);
    }
};


router.get('/countries', async (req, res) => {
    const { name } = req.query; // Guardo el name pasado por query
    try {
        await dbComplete(); // Guardo en una constante lo que obtengo de la api
        // si viene un "name" por query
        if (name) {
            // console.log('Respuesta query con name');
            let result = await Country.findAll(  // Si la db esta llena no se hace nada
                {
                    where: {
                        name: { // Operador que busca coincidencias y no es case sensitive
                            [Op.iLike]: `%${name}%`,  //(case insensitive) //Si solo pongo queryName me toma la busqueda exacta
                            //ver https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
                        },
                       // include: Activity  //include para hacer el join de las tablas
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

    const countryId = req.params.id 

    let countryById = await Country.findByPk(countryId, {
        include : {
            model : Activity
        }
    })
    res.json(countryById || 'pais no encontrado')
    //res.status(200).send(countryById)
})




router.get('/activity', async (req,res) => {
    try {
        let activities = await Activity.findAll({  // get para el select en el front que ordena por actividades
            include: Country  
            })
        res.status(200).send(activities)
    } catch (errors) {
        res.status(500).send('Error')
    }
})



router.post('/activity', async (req,res) => {
    let {name, difficulty, duration, season, countries} = req.body
    if ( !name || !difficulty || !duration || !season || !countries ) 
    res.status(400).json({msg: 'Faltan datos'})
    try{
        // Se crea la actividad
        let newActivity = await Activity.create({
            name,
            difficulty,
            duration,
            season
        })
        // Reviso el array de paises para ver en cual se debe crear la actividad  
        Array.from(countries).forEach(async (country) => {
            let activityCountry = await Country.findOne({
                where: {
                    name: country
                }
            }) 
            await newActivity.addCountry(activityCountry)  //mixing sequelize add + nombreTabla  // fn de squalize p los modelos tb existe SET
        });
        res.status(200).send('La actividad se creo exitosamente')
    } catch(error) {
        res.status(500).send('No se pudo crear la actividad')
    }
})   

/* router.post('/activity', async (req,res) => {

    let {name, difficulty, duration, season, country} = req.body
    try{
        if(!name || !difficulty || !duration ||!season || !country)res.status(400).json({msg: "faltan datos"})
        let newActivity = await Activity.create({
            name,
            difficulty,
            duration,
            season,        
        })
        const pushCountry = await Country.findOne({
            where:{
                name: country
            }
        })
        await newActivity.addCountry(pushCountry)
        res.status(200).send('La actividad se creo exitosamente')
     
    } catch(error) {
        res.status(400).send("No se pudo crear la actividad" + error)

    }
}) */

















router.put("/:id", async (req, res) =>{
    const id = req.params.id
    const activity = req.body

    try{
        let act = await Activity.update(activity, {
            where: {
                id : id
            }
        });
        return res.send({ msg: "Actividad modificada" });

    } catch(error){
        console.log(error)
    }
})


router.delete("/:id", async function (req, res) {
    const { id } = req.params;
    try {
        if (id) {
            await Activity.destroy({
                where: { id: id },
            });
            res.send({ msg: "Actividad eliminada" });
        }
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;
