<?php
require("start.php");
if (empty($_GET['username'])) header('Location: friends.php');
if (!isset($_SESSION['user'])) {
    session_unset();
    header("Location: login.php");
}

$chatpartner = $_GET['username'];

$loadUser = $service->loadUser($chatpartner);

?>

<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Profile</title>

    <script>
        function deleteFriend() {
            if (confirm('Are you sure to delete ' + '<?= $chatpartner ?>' + '?'))
                document.getElementById("deleteFriend").submit();
        }
    </script>
</head>

<body>
    <div class="site">
        <h1>Profile of Tom</h1>
        <a class="good-a" href="chat.php?username=<?= $chatpartner ?>">&lt; Back to Chat</a> |
        <form method="post" action="friends.php" style="display: inline; cursor: pointer" id="deleteFriend">
            <a class="bad-a" type="submit" onclick="deleteFriend()">Remove Friend</a>
            <input type="hidden" name="remove" value="<?= $chatpartner ?>">
            <input type="submit" style="display: none">
        </form>
        <br>
        <br>
        <div class="img-profile-div">
            <img src="images/profile.png" alt="">
        </div>

        <div class="textbox-div">
            <?php
                if ($loadUser->getDescription() != "") {
            ?>
            <p id="description"><?= $loadUser->getDescription() ?></p>
            <?php } ?>

            <?php
                if ($loadUser->getCoffeeOrTea() > 0 && $loadUser->getCoffeeOrTea() < 4) {
            ?>
            <div>
                <strong>Coffee or Tea?</strong><br>
                <span class="values">
                    <?php if ($loadUser->getCoffeeOrTea() == 1) echo "Neither nor" ?>
                    <?php if ($loadUser->getCoffeeOrTea() == 2) echo "Coffee" ?>
                    <?php if ($loadUser->getCoffeeOrTea() == 3) echo "Tea" ?>
                </span>
            </div>
            <?php } ?>

            <?php
                if ($loadUser->getFirstName() != "") {
            ?>
            <div>
                <strong>First Name:</strong><br>
                <span class="values"><?= $loadUser->getFirstName() ?></span>
            </div>
            <?php } ?>

            <?php
            if ($loadUser->getLastName() != "") {
                ?>
                <div>
                    <strong>Last Name:</strong><br>
                    <span class="values"><?= $loadUser->getLastName() ?></span>
                </div>
            <?php } ?>
        </div>
    </div>
</body>

</html>