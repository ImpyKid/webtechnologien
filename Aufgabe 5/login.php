<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Login</title>
    <script src="credentials.js"></script>
</head>

<body>
    <div class="site">
        <div class="item-center">
            <img class="img" src="images/chat.png">
            <br>
            <h1>Please sign in</h1>
        </div>

        <form action="friends.php">
            <fieldset>
                <legend>Login</legend>
                <table>
                    <tr>
                        <td>
                            <label for="fname">Username</label>
                        </td>
                        <td>
                            <input type="text" id="fname" name="fname" placeholder="Username">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="fpwd">Password</label>
                        </td>
                        <td>
                            <input type="text" id="fpwd" name="fpwd" placeholder="Password">
                        </td>
                    </tr>
                </table>
            </fieldset>
            <div class="item-center">
                <a href="register.php"><button type="button" class="btn-grey">Register</button></a>
                <button type="submit" class="btn-blue">Login</button>
            </div>
        </form>
    </div>
</body>

</html>