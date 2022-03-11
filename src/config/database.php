<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../utils/responseObject.php';

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
}