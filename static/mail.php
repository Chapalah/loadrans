<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

$c = true;
// Формирование самого письма
$title = "Moving Quote";

foreach ( $_POST as $key => $value ) {
  if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" && $key != "calculator") {
    $title = str_replace('_', ' ', $key);
    $body .= "
    " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$title</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
    </tr>
    ";
  }
}

if (!empty($_POST['calculator'])) {
  $data = json_decode($_POST['calculator']);

  foreach($data->items as $key => $item) {
    $calculator .= "
    " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$item->count</td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$item->feet</td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$item->qty</td>
    </tr>
    ";
  }
}

$calculator .= "
" . ( ($c = !$c) ? '<tr>':'< style="background-color: #f4f7ff;">' ) . "
  <td style='padding: 10px; border: #f4f7ff 1px solid;'><b>Total</b></td>
  <td style='padding: 10px; border: #f4f7ff 1px solid;'>$data->count</td>
  <td style='padding: 10px; border: #f4f7ff 1px solid;'>$data->totalFeet</td>
  <td style='padding: 10px; border: #f4f7ff 1px solid;'>$data->totalWeight</td></tr>
";

$body = "<h1 style='margin: 30px 0px'>Quote data</h1><table style='width: 100%;'>$body</table>";

$calculator = "
<h1 style='margin: 30px 0px'>Selected items from the calculator</h1>

<table style='width: 100%;'>
  <thead>
    <tr style='background-color: #c4c4c4c4;'>
      <th style='padding: 10px; border: #f7f9fa 1px solid;'>Article</th>
      <th style='padding: 10px; border: #f7f9fa 1px solid;'>Quantity</th>
      <th style='padding: 10px; border: #f7f9fa 1px solid;'>Cubic Feet</th>
      <th style='padding: 10px; border: #f7f9fa 1px solid;'>QTY X CFT</th>
    </tr>
  </thead>
    $calculator
</table>";

$body .= $calculator;

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
  $mail->isSMTP();
  $mail->CharSet = "UTF-8";
  $mail->SMTPAuth   = true;

  // Настройки вашей почты
  $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
  $mail->Username   = 'deniswww49@gmail.com'; // Логин на почте
  $mail->Password   = 'gzgxuxoyxqvgafqy'; // Пароль на почте
  $mail->SMTPSecure = 'ssl';
  $mail->Port       = 465;

  $mail->setFrom('loadrans.quote@gmail.com', 'Moving Quote'); // Адрес самой почты и имя отправителя

  // Получатель письма
  $mail->addAddress('loadrans.quote@gmail.com');

  // Отправка сообщения
  $mail->isHTML(true);
  $mail->Subject = $title;
  $mail->Body = $body;

  $mail->send();
  $response = ['status' => 'ok'];
  header('Content-type: application/json');
  echo json_encode($response);

} catch (Exception $e) {
  $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
  $response = ['status' => $status];
  
  header('Content-type: application/json');
  echo json_encode($response);
}