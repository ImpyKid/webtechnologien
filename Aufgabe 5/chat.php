<?php
require("start.php");

if (empty($_GET['username'])) header('Location: friends.php');
if (!isset($_SESSION['user'])) {
    session_unset();
    header("Location: login.php");
}

$chatpartner = $_GET['username'];

?>

<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Chat</title>

    <script src="credentials.js"></script>
    <script src="script_m.js"></script>
    <script>
        window.chatPartner = "<?= $chatpartner ?>";
        window.chatToken = "<?= $_SESSION['chat_token'] ?>"

        function deleteFriend() {
            if (confirm('Are you sure to delete ' + window.chatPartner + '?'))
                document.getElementById("deleteFriend").submit();
        }
    </script>
</head>

<body>
    <div class="site">
        <h1>Chat with <?= $chatpartner ?></h1>
        <a class="good-a" href="friends.php">&lt; Back</a> | <a class="good-a" href="profile.php?username=<?= $chatpartner ?>">Profile</a> |
        <form method="post" action="friends.php" style="display: inline; cursor: pointer" id="deleteFriend">
            <a class="bad-a" type="submit" onclick="deleteFriend()">Remove Friend</a>
            <input type="hidden" name="remove" value="<?= $chatpartner ?>">
            <input type="submit" style="display: none">
        </form>
        <hr>
        <div class="round-border" id="chatbox">
        </div>
        <hr>
        <div class="flexbox">
            <div class="responsive"><input class="wide-text" id="input-message" type="text" placeholder="New Message" autocomplete="off" onkeyup="sendMessageWithEnterKey(event)"></div>
            <div class="normal"><button type="button" onclick="sendMessage()" class="btn-wide-grey">Send</button></div>
        </div>
    </div>
</body>

</html>