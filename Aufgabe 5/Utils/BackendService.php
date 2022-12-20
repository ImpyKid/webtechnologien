<?php
namespace Utils;
use Model\Friend;
use Model\User;

class BackendService {
    private string $base;
    private string $id;
    private string $url;

    public function __construct(string $base, string $id)
    {
        $this->base = $base;
        $this->id = $id;
        $this->url = $this->base . "/" . $this->id;
    }

    public function login(string $username, string $password): bool
    {
        try {
            $result = HttpClient::post($this->url . "/login",
                array("username" => $username, "password" => $password));
            $_SESSION['token'] = $result->token;
            return true;
        } catch (\Exception $e) {
            echo "Authentication failed, error: " . $e . "<br>";
            return false;
        }
    }

    public function register(string $username, string $password): bool
    {
        try {
            $result = HttpClient::post($this->url . "/register",
                array("username" => $username, "password" => $password));
            $_SESSION['token'] = $result->token;
            return true;
        } catch (\Exception $e) {
            echo "Registration failed, error: " . $e . "<br>";
            return false;
        }
    }

    public function loadUser(string $username): User | null {
        try {
            $result = HttpClient::get($this->url . "/user/" . $username, $_SESSION['token']);
            return User::fromJson($result);
        } catch (\Exception $e) {
            echo "Error while loading list: " . $e . "<br>";
            return null;
        }
    }

    public function saveUser(User $user): bool {
        try {
           $result = HttpClient::post($this->url . "/user/" . $user->getUsername(),
                array("firstName" => $user->getFirstName(), "lastName" => $user->getLastName(),
                    "coffeeOrTea" => $user->getCoffeeOrTea(), "description" => $user->getDescription(),
                    "layout" => $user->getLayout()),
                $_SESSION['token']);
           return true;
        } catch (\Exception $e) {
            echo "Error while saving user: " . $e . "<br>";
            return false;
        }
    }

    public function loadFriends(): Array | null {
        $friendList = array();
        try {
            $result = HttpClient::get($this->url . "/friend", $_SESSION['token']);
            foreach ($result as &$value) {
                $friendList[] = Friend::fromJson($value);
            }
            unset($value);
            return $friendList;
        } catch (\Exception $e) {
            echo "Error while loading friends: " . $e . "<br>";
            return null;
        }
    }

    public function friendRequest(Friend $friend): bool {
        try {
            HttpClient::post($this->url . "/friend", $friend->getUsername(), $_SESSION['token']);
            return true;
        } catch (\Exception $e) {
            echo "Error while requesting " . $friend->getUsername() . ": " . $e . "<br>";
            return false;
        }
    }

    public function friendAccept(Friend $friend): bool {
        try {
            HttpClient::put($this->url . "/friend/" . $friend->getUsername(),
                array("status" => "accepted"), $_SESSION['token']);
            return true;
        } catch (\Exception $e) {
            echo "Error while accepting request from " . $friend->getUsername() . ": " . $e . "<br>";
            return false;
        }
    }

    public function friendDismiss(Friend $friend): bool {
        try {
            HttpClient::put($this->url . "/friend/" . $friend->getUsername(),
                array("status" => "accepted"), $_SESSION['token']);
            return true;
        } catch (\Exception $e) {
            echo "Error while dismissing request from " . $friend->getUsername() . ": " . $e . "<br>";
            return false;
        }
    }

    public function friendRemove(Friend $friend): bool {
        try {
            HttpClient::delete($this->url . "/friend/" . $friend->getUsername(), $_SESSION['token']);
            return true;
        } catch (\Exception $e) {
            echo "Error while deleting " . $friend->getUsername() . ": " . $e . "<br>";
            return false;
        }
    }

    public function userExists(string $username): bool {
        try {
            HttpClient::get($this->url . "/user/" . $username);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getUnread(): Array | null {
        try {
            $result = HttpClient::get($this->url . "/unread", $_SESSION['token']);
            return array();
        } catch (\Exception $e){
            echo "Error while fetching unread messages: " . $e . "<br>";
            return null;
        }
    }
}