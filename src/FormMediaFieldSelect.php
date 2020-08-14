<?php

namespace Narwhal\FormMedia;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Form\Field;
use Illuminate\Support\Facades\Storage;

class FormMediaFieldSelect extends FormMediaField
{
    
    protected $limit = 9;
    protected $remove = true;

}
