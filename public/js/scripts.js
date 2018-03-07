$("title").html("prueba de cambio de titulo");

$(document).ready(function() {
  var t; //= crearTabla();

  $("input[type=submit]").on("click", function(evt) {
    //t =  crearTabla();

    evt.preventDefault();

    // console.log(evt);
    $("#btnEnviar").attr("disabled", true);
    $("#resultado").html("Iniciando la descarga....");

    $(document).ajaxSend(function(evt, jqxhr, opt) {
      //console.log(evt);
      // $("#resultado").html("ajaxSend");
    });
    $(document).ajaxStart(function(evt, jqxhr, opt) {
      //console.log(evt);
      // $("#error").html("Iniciando...");
      // $("#resultado").html("ajaxStart");
    });

   
    
    //callAjax("http://localhost:3001/tdcs");
    t = tablaServer();
  });


  $("h1").text("TDC Vivos");

  /*var socket = io.connect("http://localhost:3001");
  socket.on("emit2", function(data) {
    console.log(data);
    socket.emit("message", "hello from the browser");
  });*/

  var arrDatos = [];
  (function(io) {
    "use strict";
    var io = io();
    io.on("mensaje_inicial", function(data) {
      console.log(data);
      $("#info").html(data.message);

      // document.getElementById("hello").innerHTML = data.message;
      io.emit("mi_event_desde_cliente", { nombre: "fm", apellidos: "bv" });
    });
    io.on("rowsRecibidos", function(data) {
      $("#info").html(data.message);
    });

    io.on("filasAfectadas", function(data) {
      console.log(data.datos);
      console.log(data.datos);
      console.log(data.totalRows);
      // dataSet(data);

      // $("#resultado").html(data.datos);
      $("#error").html(data.message);
    });
    io.on("emit1", function(data) {
      console.log(data.message);
      $("#error").html(data.message);
    });
    io.on("dataset", function(data) {
      dataSet(data);
      //    console.log(data)
      arrDatos = data;
      $("#btnEnviar").attr("disabled", false);
    });
  })(io); //io del parametro => lo lee de dentro de /socket.io/socket.io.js

  function dataSet(datos) {
    console.log(JSON.stringify(datos))

    var aDatos = [],
      cabecera = [];

    datos.datos.forEach(function(element) {
      // console.log(element)
      element.forEach(function(e) {
        aDatos.push(e);
      });
    });
    console.log(JSON.stringify(datos.cabecera));

    datos.cabecera.forEach(function(element) {
      cabecera.push({ title: element.header });
    });
    console.log(JSON.stringify(cabecera));
    //console.log(misDatos.length)
    crearTabla(JSON.stringify(cabecera), aDatos); //Descomentar
  }

  function crearTabla(cabecera, dataset) {
    var t = $("#tabla").DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      processing: true,
      serverSide: false,
      sLoadingRecords: "Please wait - loading...",
      deferLoading: 500,
      iDisplayLength: 10,
      aLengthMenu: [[10, 25, -1], [10, 25, "Todos"]],
      data: dataset,
      destroy: true,
      columns: [
        { title: "c1" },
        { title: "c2" },
        { title: "c3" },
        { title: "c4" }
      ]
      //columns: cabecera
    });
    t.on("draw.dt", function(data) {
      console.log();
      //  $("#error").append( '  -> Redraw took at: '+(new Date().getTime()-startTime)+'mS' );
      $("#btnEnviar").attr("disabled", false);
    });
    /* t.on('page.dt', function(){
        console.log(t.page.info())
        console.log(t.page.info().page +" de "+t.page.info().pages)
        console.log(tcrearTabla();.data().length +'  '+t.page.info().length)
        //t.page()
        console.log(arrDatos)
      })x
*/
    return t;
  }

  function tablaServer(){
    $('#tabla').dataTable( {
      processing: true,
      serverSide: true,
      ajax: {
        url: "http://localhost:3001/tdcs",
        type: "POST",
        dataType: 'json',
        "columns" : [
          { title: "c1" },
          { title: "c2" },
          { title: "c3" },
          { title: "c4" }
        ]
      },
      aLengthMenu: [[10, 25, -1], [10, 25, "Todos"]],
 
    } );
  }


});
