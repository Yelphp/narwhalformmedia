<?php

namespace Narwhal\FormMedia;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Form\Field;
use Illuminate\Support\Facades\Storage;

class FormMediaVideo extends FormMediaField
{
    
    protected $limit = 1;
    protected $remove = true;
    protected $type = 'video';

}
