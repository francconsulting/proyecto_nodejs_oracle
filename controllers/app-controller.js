'use strict'

var AppModel = require('../models/app-models.js'),
    AppController = () => {

    }


function errorConn(err, res) {
    if (err) {
        console.log(err)
        let sError = '',
            estado = 0
        switch (err.code) {
            case "ECONNREFUSED":
            case "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR":
                estado = 1
                sError = "\n\rNo se ha podido establecer la conexión, comprueba el estado del servicio y de la base de datos"
                break;
            case "ER_BAD_DB_ERROR":
            case "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR":
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
        res.render('error', locals)
        return -1
    } else {
        return 0
    }
}
AppController.errCrud = (err, res) => {
    if (err) {
        console.log(err)
        let sError = '',
            estado = 0
        switch (err.code) {
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
        res.render('error', locals)
        return true
    } else {
        return false
    }
}


AppController.getTdcVivos = (req, res, next) => {
    AppModel.getTdcVivos((err, results) => {
      console.log('sssssssssssssssssssssssssssssssss')
    })
}





AppController.error404 = (req, res, next) => {
    let error = new Error(),
        locals = {
            title: "Error 404",
            desc: "pagina no encontrada",
            error: error
        }

    error.status = 404
    res.render('error', locals)

    next()
}



module.exports = AppController