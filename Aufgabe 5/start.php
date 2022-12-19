<?php
spl_autoload_register(function ($class) {
    include str_replace('\\', '/', $class) . '.php';
});

session_start();

define('CHAT_SERVER_URL', 'https://online-lectures-cs.thi.de/chat');
define('CHAT_SERVER_ID', 'c94d846a-7475-48b8-94e8-eec445d23b3f');

$service = new Utils\BackendService(CHAT_SERVER_URL, CHAT_SERVER_ID);