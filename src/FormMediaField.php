<?php

namespace Narwhal\FormMedia;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Form\Field;
use Illuminate\Support\Facades\Storage;

class FormMediaField extends Field
{
    protected $view = 'narwhalformmedia::mediayel_field';

    protected static $js = [
        'vendor/yelphp/narwhalformmedia/mediayel_field.js'
    ];
 
    protected static $css = [
        'vendor/yelphp/narwhalformmedia/mediayel_field.css'
    ];

    protected $limit = 1;
    protected $rootpath = '';
    protected $remove = false;

    /**
     * Set rows of textarea.
     *
     * @param int $rows
     *
     * @return $this
     */
    public function limit($limit = 1)
    {
        $this->limit = $limit;

        return $this;
    }

    public function remove($tag = false){
        $this->remove = $tag;
        return $this;
    }

    public function render()
    {   
        $disk = config('admin.upload.disk');

        $storage = Storage::disk($disk);

        $this->addVariables([
            'limit' => $this->limit,
            'rootpath' => $storage->url(''),
            'remove' => $this->remove,
            'xie' => '/'
        ]);
        return parent::render();
    }



}
