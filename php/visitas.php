<?php

if(isset($_POST['opcion'])) {
 echo contador_visitas($_POST['opcion']);
}

if(isset($_POST['suscripcion'])) {
 echo guardarSuscriptor();
}

function contador_visitas($sumar) {
 	$archivo = "contador.txt";
 	$info = array();

 	//comprobar si existe el archivo
 	if (file_exists($archivo)) {
  	// abrir archivo de texto y introducir los datos en el array $info
  	$fp = fopen($archivo,"r");
  	$contador = fgets($fp, 26);
  	$info = explode(" ",$contador);
  	fclose($fp);

  	// poner nombre a cada dato
  	$dia_actual = date("z");
  	$mes_actual = date("m");
  	$dia_ultimo = $info[0];
  	$mes_ultimo = $info[1];
  	$visitas_dia = $info[2];
  	$visitas_mes = $info[3];
  	$visitas_totales = $info[4];
 	} else {
		// inicializar valores
  	$dia_actual = date("z");
  	$mes_actual = date("m");
  	$dia_ultimo = "0";
  	$mes_ultimo = "0";
  	$visitas_dia = 0;
  	$visitas_mes = 0;
  	$visitas_totales = 0;
 	}

 	// incrementar las visitas del mes según si estamos en el mismo
 	// mes/dia o no que el de la ultima visita, o ponerlas a cero
  if($sumar == 1) {
   	if ($dia_actual == $dia_ultimo && $mes_actual == $mes_ultimo){
    	$visitas_dia++;
   	} else {
    	$visitas_dia=1;
   	}
   	if ($mes_actual==$mes_ultimo) {
  		$visitas_mes++;
   	} else {
    	$visitas_mes=1;
   	}
   	$visitas_totales++;
  }

   	// reconstruir el array con los nuevos valores
   	$info[0] = $dia_actual;
   	$info[1] = $mes_actual;
   	$info[2] = $visitas_dia;
   	$info[3] = $visitas_mes;
   	$info[4] = $visitas_totales;


   	// grabar los valores en el archivo de nuevo
   	$info_nueva = implode(" ",$info);
    if($sumar == 1) {
     	$fp = fopen($archivo,"w+");
     	fwrite($fp, $info_nueva, 26);
     	fclose($fp);
    }
   	// devolver el array
   	return $info_nueva;
}

function guardarSuscriptor() {
  // Conectando, seleccionando la base de datos
  $servername = "localhost";
  $username = "ordenyse_suscrip";
  $password = "ordenyse_7heeap12g9";
  $dbname = "ordenyse_suscripciones";

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  } else {
  	//echo "conectado a la base de datos";
  }

  $sql = "INSERT INTO suscriptores (correo, telefono, nombre, descripcion)
  VALUES ('" .$_POST['correo']. "', '".$_POST['telefono']."', '".$_POST['nombre']."', '".$_POST['descripcion']."')";

  $respuesta = 0;

  if ($conn->query($sql) === TRUE) {
    $respuesta = 1;
  } else {
    	//echo " no se pudieron guardar los datos";
    	//echo "Error: " 	. $conn->error;
  }

  enviarSuscriptoresCorreo($conn);

  $conn->close();
  return $respuesta;

}

function enviarSuscriptoresCorreo ($conn) {
	//Titulo
	$titulo = "Suscriptores de Orden y Seguridad";
	//cabecera
	$headers = "MIME-Version: 1.0\r\n";
	$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
	$bodyEmail = "<h3>Lista de usuarios Suscritos</h3>";
	$bodyEmail .= "<table border=1 cellspacing=0 cellpadding=2 bordercolor='666633'>";
	$bodyEmail .= "<tr>";
	$bodyEmail .= "<th>Nombre</th>";
	$bodyEmail .= "<th>Correo</th>";
	$bodyEmail .= "<th>Telefono</th>";
	$bodyEmail .= "<th>Description</th>";
	$bodyEmail .= "</tr>";
	$sqlAllUsers = "SELECT * FROM suscriptores";
	$result = $conn->query($sqlAllUsers);
	while ($row = $result->fetch_row()){
	    $bodyEmail .=  "<tr>";
	    $bodyEmail .=  "<td>$row[2]</td>";
	    $bodyEmail .=  "<td>$row[0]</td>";
	    $bodyEmail .=  "<td>$row[1]</td>";
	    $bodyEmail .=  "<td>$row[3]</td>";
	    $bodyEmail .=  "</tr>";
	}
	$bodyEmail .=  "</table>";
	$emailRecipient = "lx.mw001@gmail.com, gloveapp@hotmail.com";
	if(@mail($emailRecipient, $titulo, $bodyEmail, $headers)) {
//		echo "Mail Sent Successfully";
	}else{
//	  echo "Mail Not Sent";
	}
}

?>