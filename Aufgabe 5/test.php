<?php
require("start.php");
$service = new Utils\BackendService(CHAT_SERVER_URL, CHAT_SERVER_ID);
$service->login("Tom", "12345678");
$service->getUnread();