<?php


namespace Contactical;


class Error
{
    /** @var string $title */
    private $title;

    /** @var string $status */
    private $status;

    /** @var string $detail */
    private $detail;

    function __construct($title, $detail="An unexpected error occurred", $status=400)
    {
        $this->title = $title;
        $this->detail = $detail;
        $this->status = $status;
    }

    function toArray()
    {
        return array("title" => $this->title, "status" => $this->status, "detail" => $this->detail);
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getDetail()
    {
        return $this->detail;
    }

    /**
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }
}