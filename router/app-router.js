'use strict'

var AppController = require('../controllers/app-controller'),
    express = require('express'),
    router = express.Router()
/**
 * LA FUNCTION TPL NO LA VAMOS A USAR
 * 
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */






router
    .get('/', function (req, res){
        res.send("hola")
    })
    .get('/tdc', AppController.getTdcVivos)
 
    /*
    .get('/', PelisController.getAll)
    .get('/agregar', PelisController.addForm)
    //.post('/agregar', PelisController.insert)     //unificar el método insert junto con el actualizar en el metodo save
    .post('/agregar', PelisController.save)
    .get('/editar/:pelis_id', PelisController.getOne)
    //.post('/actualizar/:pelis_id', PelisController.update)
    //.put('/actualizar/:pelis_id', PelisController.update)       //unificar el método insert junto con el actualizar en el metodo save
    .put('/actualizar/:pelis_id', PelisController.save)       
    //.post('/eliminar/:pelis_id', PelisController.delete)
    .delete('/eliminar/:pelis_id', PelisController.delete)
   */ // .get('/tpl/:id', tpl)     //ESTA RUTA NO LA VAMOS A USAR
    .use(AppController.error404) //se pone use(middlware) porque no podemos definir una ruta  y debe estar al final

module.exports = router