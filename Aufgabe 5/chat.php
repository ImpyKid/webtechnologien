<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Chat</title>

    <script src="credentials.js"></script>
    <script src="script_m.js"></script>
</head>

<body>
    <div class="site">
        <h1>Chat with Tom</h1>
        <a class="good-a" href="friends.php">&lt; Back</a> | <a class="good-a" href="profile.php">Profile</a> | <a
            class="bad-a" href="friends.php">Remove Friend</a>
        <hr>
        <div class="round-border" id="chatbox">
        </div>
        <hr>
        <form action="chat.php" id="submitFormChat" method="get" autocomplete="off">
            <div class="flexbox">
                <div class="responsive"><input class="wide-text" id="input-message" type="text" placeholder="New Message"></div>
                <div class="normal"><a href="#"><button type="button" onclick="sendMessage()" class="btn-wide-grey">Send</button></a></div>
            </div>
        </form>
    </div>
</body>

</html>