<?php

namespace App\controllers;

use App\models\AdModel;
use App\models\CategoryModel;
use App\models\CommentModel;
use Exception;

class PagesController
{
    public function index()
    {
        try {
            $isOutOfDate = isset($_GET['isOutOfDate']) && $_GET['isOutOfDate'] == "1";
            $categories = CategoryModel::findAll();
            $comments = CommentModel::findLastFive();
            $user = getSessionUser();

            if (isset($_GET['filter']) && isset($_GET['search']))
                $ads = AdModel::findAllByCategoryIdAndSearch($_GET['filter'], $_GET['search'], $isOutOfDate);
            else if (isset($_GET['filter']))
                $ads = AdModel::findAllByCategoryId($_GET['filter'], $isOutOfDate);
            else if (isset($_GET['search']))
                $ads = AdModel::findAllBySearch($_GET['search'], $isOutOfDate);
            else
                $ads = AdModel::findAll($isOutOfDate);

            require_once __DIR__ . '/../views/pages/index.php';
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
            return;
        }
    }

    public function error(string $message)
    {
        $errorMessage = $message;
        require_once __DIR__ . '/../views/pages/error.php';
    }

    public function success(string $message)
    {
        $successMessage = $message;
        require_once __DIR__ . '/../views/pages/success.php';
    }
}