<?php
require("start.php");
if (!isset($_SESSION['user'])) {
    session_unset();
    header("Location: login.php");
}

$loadUser = $service->loadUser($_SESSION['user']);

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $saveUser = new \Model\User($_SESSION['user']);
    $saveUser->setFirstName($_POST['name']);
    $saveUser->setLastName($_POST['surname']);
    $saveUser->setCoffeeOrTea((int)$_POST['coffeeOrTea']);
    $saveUser->setDescription($_POST['description']);
    $saveUser->setLayout((int)$_POST['layout']);

    $service->saveUser($saveUser);

    $loadUser = $service->loadUser($_SESSION['user']);
}

?>

<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Settings</title>
</head>

<body>
<div class="site">
    <form method="post" action="settings.php">
        <h1>Profile Settings</h1>
        <fieldset>
            <legend>Base Data</legend>
            <table>
                <tr>
                    <td>
                        <label for="name">First Name</label>
                    </td>
                    <td>
                        <input type="text" name="name" id="name" placeholder="Your name"
                               value="<?= $loadUser->getFirstName() ?>">
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="surname">Last Name</label>
                    </td>
                    <td>
                        <input type="text" name="surname" id="surname" placeholder="Your surname"
                               value="<?= $loadUser->getLastName() ?>">
                    </td>
                </tr>
                <tr>
                    <td>
                        Coffee or Tea?
                    </td>
                    <td>
                        <select name="coffeeOrTea">
                            <option value="1" <?= $loadUser->getCoffeeOrTea() == 1 ? ' selected="selected"' : '' ?>>
                                Neither Nor
                            </option>
                            <option value="2" <?= $loadUser->getCoffeeOrTea() == 2 ? ' selected="selected"' : '' ?>>
                                Coffee
                            </option>
                            <option value="3" <?= $loadUser->getCoffeeOrTea() == 3 ? ' selected="selected"' : '' ?>>
                                Tea
                            </option>
                        </select>
                    </td>
                </tr>
            </table>
        </fieldset>
        <fieldset>
            <legend>Tell Something About You</legend>
            <textarea id="text-comment" name="description" placeholder="Leave a comment here"><?= $loadUser->getDescription() ?></textarea>
        </fieldset>
        <fieldset>
            <legend>Preferred Chat Layout</legend>
            <p>
                <input type="radio" name="layout" id="one_line" <?= $loadUser->getLayout() == 1 ? 'checked' : '' ?> value="1">
                <label for="one_line"> Username and message in one line</label>
            </p>
            <p>
                <input type="radio" name="layout" id="sep_line" <?= $loadUser->getLayout() == 2 ? 'checked' : '' ?> value="2">
                <label for="sep_line"> Username and message in separated lines</label>
            </p>
        </fieldset>
        <div class="item-center">
            <button class="btn-grey" type="button" onclick="location.href='friends.php'">Cancel</button>
            <button class="btn-blue" type="submit">Save</button>
        </div>
    </form>
</div>
</body>

</html>