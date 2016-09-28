$(document).ready(verificar_cookie);
function contador(opcion){
    $.ajax({
       url: "php/visitas.php",
       type: "post",
       data: "opcion="+opcion,
       success: function(data){
          var response = data.split(" ");
          $("#hoy").text(response[2]);
          $("#mes").text(response[3]);
          $("#total").text(response[4]);
       }
    });
}

function guardar_cookie() {
  var date = new Date();
  var minutes = 240;
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  $.cookie("contador", "visitas", { expires: date });
}

function verificar_cookie() {
  var visitado = $.cookie("contador");
  if(visitado) {
    contador(0);
  } else {
    contador(1);
    guardar_cookie();
  }
}

//Formulario de suscripcion
$(document).ready(function(){
    setTimeout(function() {
        // $("#myModal").modal();
    }, 5000);
});


$(document).ready(function(){
    $("#suscribe").click(function(){
        // $("#myModal").modal();
    });
});

function suscribir() {
  var email = $('#email').val();
  var telefono = $('#phone').val();
  var nombre = $('#nombre').val();
  var descripcion = $('#descripcion').val();

  if(!validarCampos(email, telefono, nombre, descripcion)) {
  	return;
  }

  var parametros = {
         "suscripcion" : "true",
         "correo" : email,
         "telefono" : telefono,
         "nombre" : nombre,
         "descripcion" : descripcion
      };

  $.ajax({
       url: "visitas.php",
       type: "post",
       data: parametros,
       success: function(data){
         if(data == '1') {
           alert('Suscrito correctamente');
           $('#myModal').modal('hide');
         } else {
           alert('Ya esta suscrito');
         }
           $('#email').val('');
           $('#phone').val('');
           $('#nombre').val('');
           $('#descripcion').val('');
       }
    });
}

function validarCampos(email, telefono, nombre, descripcion) {
   var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   if (!expr.test(email)){
	$('#email').focus();
	alert("La dirección de email es incorrecta.");
	return false;
   }

   return true;

}