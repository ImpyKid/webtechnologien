<?php
namespace Model;
use JsonSerializable;

class User implements JsonSerializable
{
    private string $username;

    private string $firstName = '';
    private string $lastName = '';
    private int $coffeeOrTea = 0;
    private string $description  = '';
    private int $layout = 0;

    function __construct($username = "null")
    {
        $this->username = $username;
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

    /**
     * @return string
     */
    public function getFirstName(): string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     */
    public function setFirstName(string $firstName): void
    {
        $this->firstName = $firstName;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     */
    public function setLastName(string $lastName): void
    {
        $this->lastName = $lastName;
    }

    /**
     * @return int
     */
    public function getCoffeeOrTea(): int
    {
        return $this->coffeeOrTea;
    }

    /**
     * @param int $coffeeOrTea
     */
    public function setCoffeeOrTea(int $coffeeOrTea): void
    {
        $this->coffeeOrTea = $coffeeOrTea;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * @return int
     */
    public function getLayout(): int
    {
        return $this->layout;
    }

    /**
     * @param int $layout
     */
    public function setLayout(int $layout): void
    {
        $this->layout = $layout;
    }
}