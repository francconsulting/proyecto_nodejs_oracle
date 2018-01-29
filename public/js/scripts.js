$("title").html("prueba de cambio de titulo");
$(document).ready(function() {
  $("input[type=submit]").on("click", function(evt) {
     evt.preventDefault();
   // console.log(evt);
   $("#resultado").html("")
   callAjax("http://localhost:3000/tdcs", printTabla,null, "post", "HTML");


  });

  function printTabla(datos){
    $("#resultado").html(datos)
  }
  $("h1").text("pruebaaa");
});
