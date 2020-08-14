<?php

namespace Narwhal\FormMedia;

use Illuminate\Support\ServiceProvider;
use Encore\Admin\Admin;
use Encore\Admin\Form;

class FormMediaServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function boot(FormMedia $extension)
    {
        if (! FormMedia::boot()) {
            return ;
        }

        if ($views = $extension->views()) {
            $this->loadViewsFrom($views, 'narwhalformmedia');
        }

        if ($this->app->runningInConsole() && $assets = $extension->assets()) {
            $this->publishes(
                [$assets => public_path('vendor/yelphp/narwhalformmedia')],
                'narwhalformmedia'
            );
        }

        // 加载插件
        Admin::booting(function () {
            Form::extend('photo', FormMediaField::class);
            Form::extend('photos', FormMediaFieldSelect::class);
        });

        // 加载路由
        $this->app->booted(function () {
            FormMedia::routes(__DIR__.'/../routes/web.php');
        });

        
    }
}