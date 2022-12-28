<?php
require("start.php");

$message = "";

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $checks = false;
    $checkUsername = true;
    $checkUsernameExist = true;
    $checkPassword = true;
    $checkPasswordConfirm = true;
    $username = $_POST['fname'];
    $password = $_POST['fpwd'];
    $password_confirm = $_POST['fpwd-confirm'];

    if ($username === "" || strlen($username) < 3) $checkUsername = false;
    if ($service->userExists($username)) $checkUsernameExist = false;
    if ($password === "" || strlen($password) < 8) $checkPassword = false;
    if ($password !== $password_confirm) $checkPasswordConfirm = false;

    if ($checkUsername && $checkUsernameExist && $checkPassword && $checkPasswordConfirm) $checks = true;

    if ($checks) {
        $success = $service->register($username, $password);
        if ($success) {
            $_SESSION['user'] = $username;
            header('Location: friends.php');
        } else {
            $message = "Error while register user.";
        }
    } else {
        if (!$checkUsername) $message = "Username is empty or too short.";
        if (!$checkUsernameExist) $message .= ($message != "" ? "<br>" : "") . "Username exists already.";
        if (!$checkPassword) $message .= ($message != "" ? "<br>" : "") . "Password is empty or too short.";
        if (!$checkPasswordConfirm) $message .= ($message != "" ? "<br>" : "") . "Passwords do not match.";
    }
}

?>

<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Register</title>
    <script src="credentials.js"></script>
    <script src="script_p.js"></script>

    <script>
        window.chatCollectionId = "<?= CHAT_SERVER_ID ?>";
        window.chatServer = "<?= CHAT_SERVER_URL ?>";
    </script>
</head>

<body>
    <div class="site">
        <div class="item-center">
            <img class="img" src="images/user.png">
            <br>
            <h1>Register yourself</h1>
        </div>

        <p class="error-message"><?= $message ?></p>

        <form action="register.php" id="registerForm" name="registerForm" method="post">
            <fieldset>
                <legend>Register</legend>
                <table>
                    <tr>
                        <td>
                            <label for="fname">Username</label>
                        </td>
                        <td>
                            <input type="text" id="fname" name="fname" placeholder="Username" onfocus="changeBorder(this)" required>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="fpwd">Password</label>
                        </td>
                        <td>
                            <input type="password" id="fpwd" name="fpwd" placeholder="Password" onfocus="changeBorder(this)" required>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="fpwd-confirm">Confirm Password</label>
                        </td>
                        <td>
                            <input type="password" id="fpwd-confirm" name="fpwd-confirm" placeholder="Confirm Password" onfocus="changeBorder(this)" required>
                        </td>
                    </tr>
                </table>
            </fieldset>
            <div class="item-center">
                <a href="login.php"><button type="button" class="btn-grey">Cancel</button></a>
                <button id="createaccount" type="submit" class="btn-blue">Create Account</button>
            </div>
        </form>
    </div>
</body>

</html>