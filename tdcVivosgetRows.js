/**
 * ejecutar siempre esto en la ventana donde se inicia node
 *  export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
 *
 * parta ejecutar manualmente con aumento de memoria de nodejs necesario para
 * que corra de forma correcta la api:
 *      node tdcVivosgetRows.js --max_old_space_size=8192 --optimize_for_size --stack_size=8192
 *
 * Para ejecutarlo automaticamente, se ha introducido en el package.json la
 * linea "dev" en escript. Se debe ejecutar el siguiente comando:
 *      npm run dev
 *
 */

var //oracledb = require("oracledb"),
  //dbConfig = require("./dbconfig.js"),
  ConnBd = require("./connBd.js"),
  fs = require("fs"),
  ExcelFile = require("./excelFile"),
  reloj = require("./reloj"),
  numRows = 300, //bloque de registros a recibir
  iRowsAffec = 0, //registros recuperados
  arrayHeader = [],
  arrayData = [];

/*oracledb.outFormat = oracledb.ARRAY;
oracledb.poolMax = 4;
oracledb.poolPingInterval = 60;
oracledb.fetchArraySize = 100;*/

/*var conectar = function(cb) {
  oracledb.getConnection(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      stmtCacheSize: 2000
    },
    cb
  );
};*/

var tdcs = (err, conn) => {
  if (err) {
    console.log("Error en la conexion");
    return;
  }
  mensaje = "Conectado. Esperando a ejecutar la consulta.....";
  reloj.setMensaje(mensaje);
  reloj.timeStart();

  var ssql = "SELECT     /*+ FULL(TDC) PARALLEL(TDC, 4) */ ";
  ssql += " TDC.DISTRIBUIDORA, ";
  ssql += " TDC.CEMPTITU, ";
  ssql +=
    " SUBSTR ('00000' || TDC.cemptitu,-5,5) ||'-'|| SUBSTR ('000000000000'||TDC.CONTREXT,-12,12)||'-'||SUBSTR ('000'||TDC.csecutdc,-3,3) as CODTDC, ";
  ssql += " TDC.FGENETDC AS fecha_gener_tdc, ";
  ssql +=
    " TDC.FULCBEST AS Fecha_ult_cambio_estado,     TDC.FCUMPTDC AS fecha_cumplimentacion_tdc, ";
  ssql += " TDC.FEJECTDC AS fecha_eje_tdc,    TDC.FFINATDC AS fecha_fin_tdc, ";
  ssql +=
    " TDC.ccounips, TDC.cupsree,    TDC.contrext,     TDC.cfinca,    TDC.cptoserv,    TDC.cderind,    TDC.ctarifa,     TDC.vpotppal,     TDC.TESTTDC, ";
  ssql += " TDC.DELEMTAB_ESTADO AS desc_estado_tdc, ";
  ssql += " TDC.CORIGTDC AS cod_origen_tdc, ";
  ssql += " TDC.DELEMTAB_ORIGEN AS desc_origen_tdc, ";
  ssql += " TDC.CTIPOTDC AS cod_tipo_tdc, ";
  ssql += " TDC.DELEMTAB_TIPO AS desc_tipo_tdc, ";
  ssql += " TDC.CMOTITDC AS cod_motivo_tdc, ";
  ssql += " TDC.DELEMTAB_MOTIVO AS desc_motivo_tdc, ";
  ssql += " TDC.TINDAVI AS cod_indicativo_aviso,  ";
  ssql += " TDC.DELEMTAB_AVISO AS des_indicat_aviso, ";
  ssql += " TDC.CMOTITIP, ";
  ssql += " TDC.DELEMTAB_MOTTIP, ";
  ssql += " TDC.DESCRTDC, ";
  ssql += " TDC.CUNIEJEC as cod_UE, TDC.DUNIEJEC as desc_UE,  ";
  ssql +=
    " TDC.CZONAUE_T8UUEE as cod_zonaUE, TDC.DZONA_T8UUEE as desc_zonaUE, ";
  ssql +=
    " TDC.CSUBZONA_T8UUEE as cod_subzonaUE, TDC.DSUBZONA_T8UUEE as desc_subzonaUE,";
  ssql +=
    " SUBSTR('0'||EXTRACT (DAY FROM TO_DATE(TDC.FLIMCONT,'YYYYMMDD')),-2,2)||'/'|| SUBSTR('0'||EXTRACT (MONTH FROM TO_DATE(TDC.FLIMCONT,'YYYYMMDD')),-2,2) || '/'|| EXTRACT (YEAR FROM TO_DATE(TDC.FLIMCONT,'YYYYMMDD')) AS Fecha_Lim_Contr_TDC, ";
  ssql += " TDC.VDIASCN AS Dias_trans_Plazo_Contr_TDC, ";
  ssql += " TDC.VNUMPZCN AS Dias_para_Plazo_Contr_TDC, ";
  ssql += " ( ";
  ssql +=
    " SELECT to_char(FTIMESTP, 'DD/MM/YYYY HH24:MI:SS') || ' - ' || replace(replace(Trim(REPLACE(DCOMENLA,'\"','`')),chr(10),''),chr(13),'') AS COMENT_DIANA FROM ";
  ssql += " ( ";
  ssql +=
    " SELECT * FROM GIGA_OWNER.T8COENT  WHERE TOBJDIAN = 898  AND distribuidora = TDC.distribuidora AND CEMPTITU = TDC.CEMPTITU AND CODIGTDC =  TDC.CODIGTDC AND CSECUTDC = TDC.CSECUTDC  AND NOT DCOMENLA IS NULL   ";
  ssql += " ORDER BY FTIMESTP DESC ";
  ssql += " ) ";
  ssql += " where rownum = 1 ";
  ssql += " ) AS ULTIMO_COMENTARIO_DIANA ";
  ssql += " FROM GIGA_OWNER.t_gg_F_tdc TDC ";
  ssql += " WHERE ";
  ssql += " TDC.TESTTDC NOT IN (6,7,10)  ";
  ssql += " AND TDC.CLINNEG = 1 ";
  ssql += " and rownum <= 3000 ";
  ssql += " and tdc.distribuidora = 'CZZ' ";

  ssql = "select * FROM GIGA_OWNER.t1soatr TDC where rownum <= 5000 ";
  /* conn.execute(ssql, [], { resultSet: true }, (err, results) => {
    if (err) {
      console.error(err.message);
      rsClose(conn, results);
      ConnBd.close(conn);
      return;
    }
    console.log("   Ejecutando la consulta");
    getCabecera(conn, results);
    getFilas(conn, results, numRows);
  });*/

  //ConnBd.ejecutarSql(conn, ssql);

  ConnBd.ejecutarSqlPromise(conn, ssql)
    .then(results => {
      ConnBd.getCabecera(conn, results)
        .then(data => {
          arrayHeader = data;
          //console.log(data);
        })
        .then(() => {
          ConnBd.getAllRows(conn, results, numRows)
            .then(data => {
              arrayData = data.arrayData;
              iRowsAffec = data.iRowsAffec;
              console.log(data.iRowsAffec);
            })
            .then(() => {
              console.log("fin");
              ExcelFile.crearLibro("stream", "prueba.xlsx");
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
              });
            });
        });
      /*ConnBd.getAllRows(conn, results, numRows).then(data => {
      console.log(data.length);
    });*/
    })
    .catch(e => {
      console.log(e);
    });
};

//conectar(tdcs);

ConnBd.open(tdcs);
