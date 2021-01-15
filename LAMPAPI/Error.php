<?php
namespace Contactical;

use User;

class Error
{

    private static function setHeaders()
    {
        http_response_code("400");
        header('Content-type: application/json');
    }

    /**
     * @param User $user
     * @param string $message
     */
    public static function user_error($user, $message)
    {
        self::setHeaders();
        $res = $user->toArray();
        $res["message"] = $message;

        // Output json
        echo json_encode($res, JSON_PRETTY_PRINT);
        die(1);
    }

    public static function generic_error($message)
    {
        self::setHeaders();
        echo json_encode(array("message" => $message), JSON_PRETTY_PRINT);
        die(1);
    }
}