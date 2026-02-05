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

        // Handle file attachments
        $invalidFiles = [];
        if (isset($_FILES['photos']) && is_array($_FILES['photos']['name'])) {
            $fileCount = count($_FILES['photos']['name']);
            $allowedExtensions = ['jpg', 'jpeg', 'png'];
            $allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            
            for ($i = 0; $i < $fileCount; $i++) {
                if (!empty($_FILES['photos']['name'][$i])) {
                    if ($_FILES['photos']['error'][$i] === UPLOAD_ERR_OK) {
                        $fileExtension = strtolower(pathinfo($_FILES['photos']['name'][$i], PATHINFO_EXTENSION));
                        $fileMimeType = mime_content_type($_FILES['photos']['tmp_name'][$i]);
                        
                        // Validate both extension and MIME type
                        if (!in_array($fileExtension, $allowedExtensions) || !in_array($fileMimeType, $allowedMimeTypes)) {
                            $invalidFiles[] = $_FILES['photos']['name'][$i];
                            continue; // Skip this file
                        }
                        
                        $mail->addAttachment(
                            $_FILES['photos']['tmp_name'][$i], 
                            $_FILES['photos']['name'][$i]
                        );
                    } else {
                        $invalidFiles[] = $_FILES['photos']['name'][$i];
                    }
                }
            }
        }

        $mail->send();
        
        if (!empty($invalidFiles)) {
            echo 'OK_WITH_WARNINGS: Your quote request has been sent. However, the following files were not valid images and were removed: ' . implode(', ', $invalidFiles);
        } else {
            echo 'OK';
        }
    } catch (Exception $e) {
        echo "Error: {$mail->ErrorInfo}";
    }
}
?>
