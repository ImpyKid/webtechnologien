<?php
namespace Model;
use JsonSerializable;

class User implements JsonSerializable
{
    private string $username;

    function __construct()
    {
        $this->username = null;
    }

    public function getUsername() {
        return $this->username;
    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    public static function fromJson($data) {
        $user = new User();

        foreach ($data as $key => $value) {
            $user->{$key} = $value;
        }

        return $user;
    }
}