<?php

namespace Narwhal\FormMedia;

use Encore\Admin\Extension;

class FormMedia extends Extension
{
    public $name = 'narwhalformmedia';

    public $views = __DIR__.'/../resources/views';

    public $assets = __DIR__.'/../resources/assets';

    public $menu = [
        'title' => 'Formmedia',
        'path'  => 'narwhalformmedia',
        'icon'  => 'fa-gears',
    ];
}