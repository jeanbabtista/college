<?php /** @noinspection ALL */

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

class Database
{
    private static ?mysqli $instance = null;
    private string $host;
    private string $name;
    private string $username;
    private string $password;

    public function __construct()
    {
        $this->host = $_ENV['DB_HOST'];
        $this->name = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASS'];

        return $this->getInstance();
    }

    public function getInstance(): ?mysqli
    {
        if (!isset(self::$instance))
            self::$instance = new mysqli($this->host, $this->username, $this->password, $this->name);
        return self::$instance;
    }
}