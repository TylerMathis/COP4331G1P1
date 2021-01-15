<?php
namespace Contactical;

use User;

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
     * @param Error $error
     */
    public static function generic_error($error)
    {
        self::setHeaders($error->getStatus());
        echo json_encode($error->toArray(), JSON_PRETTY_PRINT);
        die(1);
    }
}