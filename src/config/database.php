<?php

use JetBrains\PhpStorm\ArrayShape;

require __DIR__ . '/../../vendor/autoload.php';
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

    #[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "bool|mysqli_result"])]
    public function connect(): array
    {
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->name);
            $this->conn->set_charset("UTF8");
            return getErrorObject(false, 'Successfully connected to database');
        } catch (Exception $e) {
            return getErrorObject(true, $e->getMessage());
        }
    }

    #[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
    public function query(string $query): array
    {
        $result = $this->conn->query($query);

        if ($this->conn->errno)
            return getErrorObject(true, $this->conn->error);
        return getErrorObject(false, 'Successfully executed query ' . $query, $result);
    }
}