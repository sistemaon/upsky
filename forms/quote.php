<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = new PHPMailer(true);

    try {
        // Gmail SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'kavallare@gmail.com';
        $mail->Password = ''; // Generate new app password!
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Email settings
        $mail->setFrom('kavallare@gmail.com', 'UpSky Quote Form');
        $mail->addReplyTo($_POST['email'], $_POST['name']);
        $mail->addAddress('kavallare@gmail.com');
        $mail->Subject = 'Request for a quote';

        $mail->Body = "From: " . $_POST['name'] . "\n";
        $mail->Body .= "Email: " . $_POST['email'] . "\n";
        $mail->Body .= "Phone: " . $_POST['phone'] . "\n\n";
        $mail->Body .= "Message:\n" . $_POST['message'];

        $mail->send();
        echo 'OK';
    } catch (Exception $e) {
        echo "Error: {$mail->ErrorInfo}";
    }
}
?>