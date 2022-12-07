<?php
namespace Model;

use JsonSerializable;

class Friend implements JsonSerializable
{

    private string $username;
    private string $status;

    public function __construct(string $username = null)
    {
        $this->username = $username;
        //$this->status = $status;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function acceptFriendRequest()
    {
        $this->status = "accepted";
    }

    public function dismissFriendRequest()
    {
        $this->status = "dismissed";
    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    public static function fromJson($data)
    {
        $friend = new Friend();

        foreach ($data as $key => $value) {
            $friend->{$key} = $value;
        }

        return $friend;
    }
}