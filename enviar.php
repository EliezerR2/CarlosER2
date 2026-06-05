<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ?page=contacto');
    exit;
}

$nombre  = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING);
$email   = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$mensaje = filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING);

if (!$nombre || !$email || !$mensaje) {
    header('Location: ?page=contacto&error=1');
    exit;
}

$destinatario = 'tu@email.com';
$asunto = "Nuevo mensaje de $nombre";
$cuerpo = "Nombre: $nombre\nEmail: $email\n\nMensaje:\n$mensaje";
$headers = "From: $email";

mail($destinatario, $asunto, $cuerpo, $headers);
header('Location: ?page=contacto&exito=1');
