$("title").html("prueba de cambio de titulo");
$(document).ready(function() {
  $("input[type=submit]").on("click", function(evt) {
    evt.preventDefault();
    // console.log(evt);
    $("#resultado").html("Iniciando la descarga....");
    callAjax("http://localhost:3000/tdcs", printTabla, null, "post", "html");
  });

  function printTabla(datos) {
    $("#resultado").html(datos);
  }
  $("h1").text("TDC Vivos");
});
  