<?php

namespace Narwhal\FormMedia;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Form\Field;
use Illuminate\Support\Facades\Storage;

class FormMediaFieldSelect extends Field
{
    protected $view = 'narwhalformmedia::mediayel_field';
 
    protected static $css = [
        'vendor/yelphp/narwhalformmedia/mediayel_field.css'
    ];

    protected static $js = [
        'vendor/yelphp/narwhalformmedia/mediayel_field.js'
    ];

    protected $limit = 9;
    protected $rootpath = '';
    protected $remove = true;

    /**
     * Set rows of textarea.
     *
     * @param int $rows
     *
     * @return $this
     */
    public function limit($limit = 9)
    {
        $this->limit = $limit;

        return $this;
    }

    public function remove($tag = true){
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
        ]);

        $name = $this->column;
        $limit = $this->limit;
        $rootpath = $storage->url('');
        $remove = $this->remove;

        // 初始化
        $this->script = "
            window.Demo{$name} = new MediaYelDemo('{$name}',{$limit},'{$rootpath}',{$remove});
            Demo{$name}.init();
            Demo{$name}.getdata();//获取数据
            Demo{$name}.Run();
            // 弹出图片选择器
            $('#NarwhalMediaModel{$name}').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget) // Button that triggered the modal
                var recipient = button.data('whatever') // Extract info from data-* attributes
                var title = button.data('title') //标题
                var name = button.data('name') //标题
                var limit = button.data('limit') //标题
                var remove = button.data('remove') //标题
                var rootpath = button.data('rootpath') //标题
                var modal = $(this)
                modal.find('.modal-title').text('请选择' + title)
            })
            ";
        
        return parent::render();
    }






}
