<?php
use Model\Friend;

require("start.php");
if (!isset($_SESSION['user'])) {
    session_unset();
    header("Location: login.php");
}

$request = $service->loadFriends();
$acceptedFriends = [];
$requestedFriends = [];

if (sizeof($request) != 0) {
    foreach ($request as $friend) {
        if ($friend->getStatus() === "accepted") array_push($acceptedFriends, $friend);
        else if ($friend->getStatus() === "requested") array_push($requestedFriends, $friend);
    }
}
?>

<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">

    <script src="credentials.js"></script>
    <script src="script_m.js"></script>
    <script>
        window.chatToken = "<?= $_SESSION['chat_token'] ?>";
    </script>

    <title>Friends</title>
</head>

<body>
    <div class="site">
        <h1>Friends</h1>
        <a class="good-a" href="logout.php">&lt; Logout</a> | <a class="good-a" href="settings.php">Settings</a>
        <hr>
        <div class="round-border">
            <?php echo count($acceptedFriends) == 0 ? "No friends :(" : "" ?>
            <ul id="friend-list">
                <?php foreach ($acceptedFriends as $friend) { ?>
                <a href="chat.php?username=<?= $friend->getUsername() ?>" class="friend-list-name">
                    <li><?= $friend->getUsername() ?></li>
                    <div>300</div>
                </a>
                <?php } ?>
            </ul>
        </div>
        <hr>
        <h2>New Requests</h2>
        <ol>
            <?php foreach ($requestedFriends as $friend) { ?>
            <li>
                <a class="good-a">Friend request from <span class="name-friend"><?= $friend->getUsername() ?></span></a>
                <button name="accept" class="btn-request">Accept</button> <button name="decline" class="btn-request">Decline</button>
            </li>
            <?php } ?>
        </ol>
        <hr>
        <form action="friends.php" id="submitFormAddFriend" method="post" onsubmit="return checkUserExist(this)" autocomplete="off">
            <div class="flexbox">
                <div class="responsive">
                    <div id="add-friends">
                        <input class="wide-text" id="input-friends" onclick="getUsers()" type="text"
                            placeholder="Add Friend to list">
                    </div>
                </div>
                <div class="normal">
                    <a href="#">
                        <button class="btn-wide-grey" type="submit" value="add-friend">Add</button>
                    </a>
                </div>
            </div>
        </form>
    </div>
</body>

</html>