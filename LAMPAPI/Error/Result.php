<?php

class Result {

    /**
     * @var false|mysqli_result $sqlResult
     */
    public $sqlResult;

    /**
     * @var int $error
     */
    public $error;

    private function __construct($sqlResult, $error) {
        $this->sqlResult = $sqlResult;
        $this->error = $error;
    }

    /**
     * @param false|mysqli_result $sqlRes
     * @param int $error
     * @return Result
     */
    public static function of($sqlRes, $error) {
        return new self($sqlRes, $error);
    }
}