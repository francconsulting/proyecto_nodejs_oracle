"use strict";

var oracledb = require("oracledb"),
  dbConfig = require("./dbconfig.js"),
  reloj = require("./reloj"),
  numRows = 100,
  iRowsAffec = 0,
  arrayData = [],
  arrayHeader = [],
  ConnBd = () => {};

oracledb.outFormat = oracledb.ARRAY;
oracledb.poolMax = 4;
oracledb.poolPingInterval = 60;
oracledb.fetchArraySize = 100;

ConnBd.setDatos = filas => {
  arrayData.push(filas);
};

ConnBd.setRows = filas => {
  numRows = filas;
};

/**
 * Apertura de la conexion a la BD
 * @param {function} cb callback
 */
ConnBd.open = cb => {
  return oracledb.getConnection(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      stmtCacheSize: 2000
    },
    cb
  );
};

/**
 * Cerrar la conxion a la BD
 * @param {Object} conn
 */
ConnBd.close = conn => {
  setTimeout(() => {
    conn.close(err => {
      if (err) {
        console.log("Error al cerrar la Conexionn");
      }
      console.log("conexion Cerrada");
    });
  }, 1000); //retrasar el cierre de la conexion 1seg
};

/**
 * Cerrar el recordset
 * @param {Object} conn
 * @param {array} results
 */
ConnBd.closeRs = (conn, results) => {
  if (results != undefined) {
    results.resultSet.close(err => {
      if (err) {
        console.log("Error al cerrar el recordSet");
      }
      console.log("recordset Cerrado");
    });
  }
};

/**
 * Ejecutar una instruccion select
 * @param {Object} conn
 * @param {String} ssql
 */
ConnBd.ejecutarSql = (conn, ssql) => {
  //console.log(conn);
  var cab, f, rs, dataRs;
  var cab = conn.execute(ssql, [], { resultSet: true }, (err, results) => {
    if (err) {
      console.error(err.message);
      ConnBd.closeRs(conn, results);
      ConnBd.close(conn);
      return;
    }

    console.log("   Ejecutando la consulta");

    _getCabecera(conn, results);
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", numRows);

    // _getFilas(conn, results, numRows);
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", f);
    ConnBd.getAllRows(conn, results, numRows).then(data => {
      console.log(arrayHeader.length, "---", arrayData.length);
    });
  });
};

ConnBd.ejecutarSqlPromise = (conn, ssql) => {
  return new Promise((resolve, reject) => {
    conn.execute(ssql, [], { resultSet: true }, (err, results) => {
      if (err) {
        //console.error(err.message);
        reloj.timeStop();
        ConnBd.closeRs(conn, results);
        ConnBd.close(conn);
        // return;
        reject(err.message);
      }
      resolve(results);
    });

    // resolve(conn.execute(ssql, [], { resultSet: true }));
  });
};

ConnBd.getAllRows = (conn, results, numRows) => {
  return new Promise((resolve, reject) => {
    function _getF(conn, results, numRows) {
      results.resultSet.getRows(numRows, function(err, rows) {
        if (err) {
          //si se produce un error
          console.error(err.message);
          ConnBd.closeRs(conn, results);
          // rsClose(conn, results); //cerrar el recordset
          ConnBd.close(conn); //cerrar la conexion
          reloj.timeStop(); //parar el reloj
          return;
        } else if (rows.length > 0 || iRowsAffec > 0) {
          //cuando hay datos en la consulta o cuando ya hay filas recuperadas
          console.log(rows.length);
          arrayData.push(rows); //guardar los datos en un array

          iRowsAffec += rows.length; //filas recuperadas

          mensaje = " Recibiendo datos ...... recibidos: " + iRowsAffec;
          reloj.setMensaje(mensaje); //definir un nuevo mensaje
          reloj.getMensaje(); //mostrar el mensaje

          if (rows.length === numRows) {
            //comprobacion la ultima vez por si hay mas registros
            _getF(conn, results, numRows);
          } else {
            //cuando finaliza la recuperacion de datos
            console.log("   Registros recuperados:", iRowsAffec);
            ConnBd.closeRs(conn, results);
            ConnBd.close(conn);
            reloj.timeStop();
            resolve({ arrayData: arrayData, iRowsAffec: iRowsAffec });
          }
        } else {
          //cuando no hay datos en la consulta
          console.log("<<<< No hay datos para la consulta planteada >>>>");
          reloj.timeStop();
          ConnBd.closeRs(conn, results);
          ConnBd.close(conn);
        }
      });
    }
    _getF(conn, results, numRows);
  });
};

ConnBd.getCabecera = (conn, results) => {
  return new Promise((resolve, reject) => {
    let cabecera = results.resultSet.metaData;
    //console.log(cabecera.length)

    arrayHeader = cabecera.map(item => {
      return { header: item.name, key: item.name };
    });
    resolve(arrayHeader);
  });

  //console.log(arrayHeader);
};

ConnBd.getFilas = (conn, results, numRows) => {
  return new Promise((success, reject) => {
    results.resultSet.getRows(numRows, function(err, rows) {
      if (err) {
        //si se produce un error
        console.error(err.message);
        ConnBd.closeRs(conn, results);
        // rsClose(conn, results); //cerrar el recordset
        ConnBd.close(conn); //cerrar la conexion
        reloj.timeStop(); //parar el reloj
        return;
      } else if (rows.length > 0 || iRowsAffec > 0) {
        //cuando hay datos en la consulta o cuando ya hay filas recuperadas
        console.log(rows.length);
        arrayData.push(rows); //guardar los datos en un array

        iRowsAffec += rows.length; //filas recuperadas

        mensaje = " Recibiendo datos ...... recibidos: " + iRowsAffec;
        reloj.setMensaje(mensaje); //definir un nuevo mensaje
        reloj.getMensaje(); //mostrar el mensaje

        if (rows.length === numRows) {
          //comprobacion la ultima vez por si hay mas registros
          ConnBd.getFilas(conn, results, numRows);
        } else {
          //cuando finaliza la recuperacion de datos
          console.log("   Registros recuperados_1:", iRowsAffec);
          ConnBd.closeRs(conn, results);
          ConnBd.close(conn);
          reloj.timeStop();
          success(arrayData);
          //TODO:   hacerlo como un metodo independiente donde se le pase Tipo, Nombre Fichero, nombre Hoja, y Array de datos
          /* ExcelFile.crearLibro("stream", "prueba.xlsx");
          ExcelFile.crearHoja("miHoja");
          ExcelFile.getHoja("miHoja");
          ExcelFile.setCabecera(arrayHeader);
  
          let i = 0;
          arrayData.forEach(element => {
            element.forEach(e => {
              ExcelFile.dataControl(e, i, iRowsAffec);
              i++;
              if (i == iRowsAffec) {
                reloj.timeStop();
              }
            });
          });*/
          //TODO:  Fin
        }
      } else {
        //cuando no hay datos en la consulta
        console.log("<<<< No hay datos para la consulta planteada >>>>");
        reloj.timeStop();
        ConnBd.closeRs(conn, results);
        ConnBd.close(conn);
      }
    });
  });
};

/**
 * Ontener el nombre de los campos de la consulta
 * @param {Object} conn
 * @param {array} results
 */
function _getCabecera(conn, results) {
  let cabecera = results.resultSet.metaData;
  //console.log(cabecera.length)
  return (arrayHeader = cabecera.map(item => {
    return { header: item.name, key: item.name };
  }));
  //console.log(arrayHeader);
}

/**
 * Recuperar los registros de la consulta
 * @param {*} conn    conexion a la base de datos
 * @param {array} results  registros recuperados
 * @param {integer} numRows numero de registros a recuperar en cada recuperación de datos
 */
function _getFilas(conn, results, numRows) {
  results.resultSet.getRows(numRows, function(err, rows) {
    if (err) {
      //si se produce un error
      console.error(err.message);
      ConnBd.closeRs(conn, results);
      // rsClose(conn, results); //cerrar el recordset
      ConnBd.close(conn); //cerrar la conexion
      reloj.timeStop(); //parar el reloj
      return;
    } else if (rows.length > 0 || iRowsAffec > 0) {
      //cuando hay datos en la consulta o cuando ya hay filas recuperadas
      console.log(rows.length);
      arrayData.push(rows); //guardar los datos en un array

      iRowsAffec += rows.length; //filas recuperadas

      mensaje = " Recibiendo datos ...... recibidos: " + iRowsAffec;
      reloj.setMensaje(mensaje); //definir un nuevo mensaje
      reloj.getMensaje(); //mostrar el mensaje

      if (rows.length === numRows) {
        //comprobacion la ultima vez por si hay mas registros
        _getFilas(conn, results, numRows);
      } else {
        //cuando finaliza la recuperacion de datos
        console.log("   Registros recuperados_1:", iRowsAffec);
        ConnBd.closeRs(conn, results);
        ConnBd.close(conn);
        reloj.timeStop();

        return arrayData;
        //TODO:   hacerlo como un metodo independiente donde se le pase Tipo, Nombre Fichero, nombre Hoja, y Array de datos
        /* ExcelFile.crearLibro("stream", "prueba.xlsx");
        ExcelFile.crearHoja("miHoja");
        ExcelFile.getHoja("miHoja");
        ExcelFile.setCabecera(arrayHeader);

        let i = 0;
        arrayData.forEach(element => {
          element.forEach(e => {
            ExcelFile.dataControl(e, i, iRowsAffec);
            i++;
            if (i == iRowsAffec) {
              reloj.timeStop();
            }
          });
        });*/
        //TODO:  Fin
      }
    } else {
      //cuando no hay datos en la consulta
      console.log("<<<< No hay datos para la consulta planteada >>>>");
      reloj.timeStop();
      ConnBd.closeRs(conn, results);
      ConnBd.close(conn);
    }
  });
}

module.exports = ConnBd;
