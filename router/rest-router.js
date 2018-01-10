'use strict'

var RestController = require('../controllers/rest-controller'),
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




function errorConn(err, res) {
    if (err) {
        console.log(err)
        let sError = '',
            estado = 0
        switch (err.code) {
            case "ECONNREFUSED":
                estado = 1
                sError = "\n\rNo se ha podido establecer la conexión, comprueba el estado de la base de datos"
                break;
            case "ER_BAD_DB_ERROR":
                estado = 2
                sError = "\n\rLa base de datos elegida no existe."
                break;
            case "ER_NO_SUCH_TABLE":
                estado = 3
                sError = "\n\rLa tabla no existe."
                break;
            case "ER_BAD_FIELD_ERROR":
                estado = 4
                sError = "\n\rEl campo no existe."
                break;
            case "ER_DUP_ENTRY":
                estado = 5
                sError = "\n\rRegistro duplicado."
                break;
        }

        let error = new Error(),
            locals = { 
            title: "problemas con la BD",
            desc: sError,
            error: error
        }
       // error.status = estado
       // res.end(err.message + sError)
       error.status = estado
        res.render('error', locals )
        return -1
    } else {
        return 0
    }
}

router
    .get('/', RestController.getCabecera)
    /*.get('/agregar', PelisController.addForm)
    //.post('/agregar', PelisController.insert)     //unificar el método insert junto con el actualizar en el metodo save
    .post('/agregar', PelisController.save)
    .get('/editar/:pelis_id', PelisController.getOne)
    //.post('/actualizar/:pelis_id', PelisController.update)
    //.put('/actualizar/:pelis_id', PelisController.update)       //unificar el método insert junto con el actualizar en el metodo save
    .put('/actualizar/:pelis_id', PelisController.save)       
    //.post('/eliminar/:pelis_id', PelisController.delete)
    .delete('/eliminar/:pelis_id', PelisController.delete)
    // .get('/tpl/:id', tpl)     //ESTA RUTA NO LA VAMOS A USAR*/
    .use(RestController.error404) //se pone use(middlware) porque no podemos definir una ruta  y debe estar al final

module.exports = router