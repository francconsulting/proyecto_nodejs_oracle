'use strict'

var RestModel = require('../models/rest-model.js'),
    RestController = () => {}

    RestController.ejecutarSqlPromise = (req, res, next ) => {
        RestModel.ejecutarSqlPromise( (err, results) => {
            console.log(res)
        })
    }
    RestController.getCabecera = (req, res, next) => {
        
            console.log(res)
        
       
    }
    RestController.getAllRows = (req, res, next) => {
        console.log(res)
    }

    RestController.error404 = (req, res, next) => {
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