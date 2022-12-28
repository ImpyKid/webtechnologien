<?php
use Model\Friend;

require("start.php");
if (!isset($_SESSION['user'])) {
    session_unset();
    header("Location: login.php");
}

if (isset($_POST['username'])) {
    $bool = $service->friendRequest(new Friend($_POST['username']));
    if(!$bool) $message = "Error while reuqest friend: " . $_POST['username'];
}

if(isset($_POST['accept'])) {
    $service->friendAccept(new Friend($_POST['accept']));
}

if(isset($_POST['decline'])) {
    $service->friendDismiss(new Friend($_POST['decline']));
}

if(isset($_POST['remove'])) {
    $service->friendRemove(new Friend($_POST['remove']));
}

$message = "";

$request = $service->loadFriends();
$acceptedFriends = [];
$requestedFriends = [];

if (sizeof($request) != 0) {
    foreach ($request as $friend) {
        if ($friend->getStatus() === "accepted") array_push($acceptedFriends, $friend);
        else if ($friend->getStatus() === "requested") array_push($requestedFriends, $friend);
    }
    $unread = $service->getUnread();

    foreach ($acceptedFriends as $friend) {
        if (isset($unread->{$friend->getUsername()})) {
            $friend->setUnread($unread->{$friend->getUsername()});
        }
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
        <h1><?= str_ends_with($_SESSION['user'], 's') ? $_SESSION['user'] . "'" : $_SESSION['user'] . "'s" ?> Friends</h1>
        <a class="good-a" href="logout.php">&lt; Logout</a> | <a class="good-a" href="settings.php">Settings</a>
        <hr>
        <div class="round-border">
            <?php echo count($acceptedFriends) == 0 ? "No friends :(" : "" ?>
            <ul id="friend-list">
                <?php foreach ($acceptedFriends as $friend) { ?>
                <a href="chat.php?username=<?= $friend->getUsername() ?>" class="friend-list-name">
                    <li><?= $friend->getUsername() ?></li>
                    <div><?= $friend->getUnread() ?></div>
                </a>
                <?php } ?>
            </ul>
        </div>
        <hr>
        <h2>New Requests</h2>
        <form action="friends.php" method="post">
            <ol id="friend-request">
                <?php foreach ($requestedFriends as $friend) { ?>
                <li>
                    <a class="good-a">Friend request from <span class="name-friend"><?= $friend->getUsername() ?></span></a>
                    <button name="accept" value="<?= $friend->getUsername() ?>" class="btn-request">Accept</button>
                    <button name="decline" value="<?= $friend->getUsername() ?>" class="btn-request">Decline</button>
                </li>
                <?php } ?>
            </ol>
        </form>
        <hr>
        <span style="color: red"><?= $message ?></span>
        <form action="friends.php" id="submitFormAddFriend" method="post" onsubmit="return checkUserExist(this)" autocomplete="off">
            <div class="flexbox">
                <div class="responsive">
                    <div id="add-friends">
                        <input class="wide-text" name="username" id="input-friends" onclick="getUsers()" type="text"
                            placeholder="Add Friend to list">
                    </div>
                </div>
                <div class="normal">
                    <button class="btn-wide-grey" type="submit" name="action" value="add-friend">Add</button>
                </div>
            </div>
        </form>
    </div>
    <script>
        window.setInterval(function() {
           let xmlhttp = new XMLHttpRequest();
           xmlhttp.onreadystatechange = function () {
               if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    let data = JSON.parse(xmlhttp.responseText);
                    let friendList = document.getElementById("friend-list");
                    let requestFriend = document.getElementById("friend-request");
                    let unread = null;

                    let xmlhttp2 = new XMLHttpRequest();
                    xmlhttp2.onreadystatechange = function () {
                        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
                            unread = JSON.parse(xmlhttp2.responseText);
                    }
                    xmlhttp2.open("GET", window.chatServer + "/" + window.chatCollectionId + "/unread", false);
                    xmlhttp2.setRequestHeader('Content-type', 'application/json');
                    xmlhttp2.setRequestHeader('Authorization', 'Bearer ' + window.chatToken);
                    xmlhttp2.send();

                    friendList.replaceChildren();
                    requestFriend.replaceChildren();

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].status === "accepted") {
                            const friendItem = document.createElement("a");
                            friendItem.setAttribute("class", "friend-list-name");
                            friendItem.setAttribute("href", "chat.php?username=" + data[i].username);
                            friendItem.innerHTML = "<li>" + data[i].username + "</li>"
                                + "<div>" + (unread[data[i].username] !== undefined ? unread[data[i].username] : 0)
                                + "</div>";

                            friendList.appendChild(friendItem);

                        } else if (data[i].status === "requested") {
                            const friendItem = document.createElement("li");
                            friendItem.innerHTML = "<a class='good-a'>Friend request from <span class='name-friend'>"
                                + data[i].username + "</span></a>"
                                + " <button name='accept' value='" + data[i].username
                                + "' class='btn-request'>Accept</button>"
                                + " <button name='decline' value='" + data[i].username
                                + "' class='btn-request'>Decline</button>";

                            requestFriend.appendChild(friendItem);
                        }
                    }
               }
           };

           xmlhttp.open("GET", window.chatServer + "/" + window.chatCollectionId + "/friend", true);
           xmlhttp.setRequestHeader('Content-type', 'application/json');
           xmlhttp.setRequestHeader('Authorization', 'Bearer ' + window.chatToken);
           xmlhttp.send();
        }, 2000);
    </script>
</body>

</html>