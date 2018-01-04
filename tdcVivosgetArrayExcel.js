/**
 * ejecutar siempre esto en la ventana donde se inicia node
 *  export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
 */

var fs = require("fs"),
  Excel = require("exceljs"),
  ExcelFile = require("./excelFile"),
  reloj = require("./reloj"),
  numRows = 50,
  iRowsAffec = 0,
  stopRowEach = 20, //numero de registros
  timePause = 3000; //milisegundos
(xls = null), (rstData = []);

var conectar = function(cb) {
  oracledb.getConnection(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      stmtCacheSize: 2000
    },
    cb
  );
};

var tdcs = (err, conn) => {
  if (err) {
    console.log("Error en la conexion");
  }
  mensaje = "Conectado. Esperando datos.....";
  reloj.setMensaje(mensaje);
  reloj.timeStart();

  conn.execute(ssql, [], { resultSet: true }, (err, results) => {
    if (err) {
      console.error(err.message);
      rsClose(conn, results);
      connClose(conn);
      return;
    }
    getFilas(conn, results, numRows);
  });
  //solicitudes(err, conn)
};

//obtiene varias filas
function getFilas(conn, results, numRows) {
  results.resultSet.getRows(numRows, function(err, rows) {
    if (err) {
      console.error(err.message);
      //CERRAR RECORDSET //TODO
      rsClose(conn, results);
      connClose(conn);
      reloj.timeStop();
      return;
    } else if (rows.length > 0) {
      rstData.push(rows);
      console.log(rstData);
      iRowsAffec += rows.length;
      mensaje = "Recibiendo datos ...... recibidos: " + iRowsAffec;
      reloj.setMensaje(mensaje);
      reloj.getMensaje();
      //console.log('------------------------------',rows.length)

      if (rows.length === numRows) {
        getFilas(conn, results, numRows);
      } else {
        console.log(JSON.stringify(rstData));
        // console.log(rows)
        console.log("Registros recuperados:", iRowsAffec);
        reloj.timeStop();
        rsClose(conn, results);
        connClose(conn);
        //console.log(rows)
      }
    } else {
      iRowsAffec == 0
        ? console.log("<<<< No hay datos para la consulta planteada >>>>")
        : console.log("Registros recuperados:", iRowsAffec);
      reloj.timeStop();
      // console.log(rows)
      rsClose(conn, results);
      connClose(conn);
    }
  });
}
function toTxt(datos) {
  fs.writeFile("dataGetRows.txt", datos);
  //   }
}

function rsClose(conn, results) {
  results.resultSet.close(err => {
    if (err) {
      console.log("Error al cerrar el recordSet");
    }
    console.log("recordset Cerrado");
  });
}

function connClose(conn) {
  setTimeout(() => {
    conn.close(err => {
      if (err) {
        console.log("Error al cerrar la Conexionn");
      }
      console.log("conexion Cerrada");
    });
  }, 1000); //retrasar el cierre de la conexion 1seg
}

var i = 0;
var arr = [];

var cadTemp = "",
  arrTemp = [];

fs.readFile("dataRawGiga.json", { encoding: "utf-8" }, (err, data) => {
  // reloj.timeStart()
  //console.log(data.toString('utf8'))
  jsonArray = JSON.parse(data);
  var i = 0;
  jsonArray.forEach(element => {
    // toExcel(element)

    element.forEach(e => {
      i++;
      arr.push(e);
      // if (i % 20000 == 0 ) {
      //   console.log (i)
      //   toExcel(arr)
      //  }
    });
  });
  console.log("Tamaño: ", arr.length);
  // toExcel(arr)
  convertirArray(arr);
  console.log("line 154 ", jsonArray.length);
  //hola(arr)
});

var wb, sheet, ws;

var convertirArray = arr => {
  var options = {
    filename: "./streamed-workbook11.xlsx",
    useStyles: true,
    useSharedStrings: true
  };
  wb = new Excel.stream.xlsx.WorkbookWriter(options);

  //console.log(wb.stream._writableState.sync = false)

  //var wb = new Excel.Workbook('./prueba.xls')

  wb.creator = "fmbv";
  wb.created = new Date();

  sheet = wb.addWorksheet("tdcvivos");

  /* wb.views = [
        {
          x: 0, y: 0, width: 10000, height: 20000,
          firstSheet: 1, activeTab: 1, visibility: 'visible'
        }
      ]*/
  ws = wb.getWorksheet("tdcvivos");
  ws.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Campaña", key: "Campaña", width: 32 },
    { header: "D.O.B.", key: "DOB", width: 10 }
  ];

  var //arrTemp = [],
  // cadTemp = '',
  iContador = 0;
  for (let i = 0; i < arr.length; i++) {
    arrTemp.push(arr[i]);
    console.log("lineas: ", arrTemp.length);

    //ws.addRow(arr[i]).commit(); //añadir filas una a una

    /*if (arrTemp.length % 250 == 0){
            setTimeout(() => {
                guardarFilasExcel(arr[i], i)
            }, 5000);
            
        }else{
                guardarFilasExcel(arr[i], i)
        }*/
    guardarFilasExcel(arr[i], i);
  }

  // console.log(process)

  /* ws.commit()
    wb.commit().then( () => {
        console.log("finalizado. Ya se puede abiri")
    })*/

  /* toExcelPromise(arr).then((results) => {
        console.log(results,'----------------------')
    })*/
};

function guardarFilasExcel(data, fila) {
  let percent = (fila + 1) * 100 / arr.length;
  if (percent < 1) {
    percent = percent.toPrecision(2);
  } else if (percent < 10 && percent == 100) {
    percent = percent.toPrecision(3);
  } else if (percent < 100) {
    percent = percent.toPrecision(4);
  }
  console.log("guardando....", percent, "% ", fila + 1, "de", arr.length);
  ws.addRow(data).commit();
  if (fila + 1 == arr.length) {
    ws.commit();
    wb.commit().then(() => {
      console.log("finalizado. Ya se puede abiri");
    });
  }
}

//conectar(tdcs)
