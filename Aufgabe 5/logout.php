<?php
    require("start.php");
    session_unset();
?>

<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Logout</title>
</head>

<body>
    <div class="item-center site">
        <img class="img" src="images/logout.png">
        <br>
        <h1>Logged out...</h1>
        <p>See u!</p>

        <p><a class="good-a" href="login.php">Login again</a></p>
    </div>
</body>

</html>