<?php

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../utils/errorObject.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

class Database
{
    private string $host;
    private string $name;
    private string $username;
    private string $password;
    protected ?mysqli $conn;

    public function __construct()
    {
        $this->host = $_ENV['DB_HOST'];
        $this->name = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASS'];
        $this->conn = null;
    }

    public function getConnection(): ?mysqli
    {
        return $this->conn;
    }

    /**
     * @throws Exception
     */
    public function connect(): bool
    {
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->name);
            $this->conn->set_charset("UTF8");
            // $this->init();
            return true;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @throws Exception
     */
    public function query(string $query): bool|mysqli_result
    {
        if (!$this->conn)
            throw new Exception('Error: database is not connected');

        $result = $this->conn->query($query);

        if ($this->conn->errno)
            throw new Exception($this->conn->error);

        return $result;
    }

    /**
     * @throws Exception
    public function init() {
        $this->tryCreateUserTable();
        $this->tryCreateAdsTable();
    }

    * @throws Exception
    public function tryCreateUserTable(): bool
    {
        list('error' => $error, 'message' => $message, 'data' => $data) = $this->query(
            "CREATE TABLE IF NOT EXISTS user (
                'id' INT NOT NULL AUTO_INCREMENT,
                'username' VARCHAR(40) NOT NULL,
                'password' VARCHAR(40) NOT NULL,
                PRIMARY KEY ('id')
            )"
        );

        if ($error)
            throw new Exception($message);

        return true;
    }

    * @throws Exception
    public function tryCreateAdsTable(): bool
    {
        list('error' => $error, 'message' => $message) = $this->query(
            "CREATE TABLE IF NOT EXISTS ad (
                'id' INT NOT NULL AUTO_INCREMENT,
                'title' VARCHAR(40) NOT NULL,
                'description' text NOT NULL,
                'user_id' INT NOT NULL,
                'image' longblob NOT NULL,
                PRIMARY KEY ('id')
            )"
        );

        if ($error)
            throw new Exception($message);

        return true;
    } */
}