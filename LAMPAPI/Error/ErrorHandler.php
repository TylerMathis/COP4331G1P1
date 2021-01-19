<?php
namespace Contactical;

use User;

/**
 * Class ErrorHandler
 * @package Contactical
 */
class ErrorHandler
{

    /**
     * @param int $code
     */
    private static function setHeaders($code)
    {
        http_response_code($code);
        header('Content-type: application/json');
    }

    /**
     * Presents an error that gives a user object in addition to the error itself.
     *
     * @param User $user
     * @param Error $error
     */
    public static function user_error($user, $error)
    {
        self::setHeaders($error->getStatus());
        $res = $error->toArray();
        $res["user"] = $user;

        // Output json
        echo json_encode($res, JSON_PRETTY_PRINT);
        die(1);
    }

    /**
     * Presents a normal error.
     *
     * @param Error $error
     */
    public static function generic_error($error)
    {
        self::setHeaders($error->getStatus());
        echo json_encode($error->toArray(), JSON_PRETTY_PRINT);
        die(1);
    }
}