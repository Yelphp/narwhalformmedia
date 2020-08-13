--- composer.json 添加：
`
	"repositories": [
	    {
	        "type": "path",
	        "url": "app/Admin/Extensions/laravel-admin-ext/narwhalformmedia"
	    }
	]
`


-- composer 安装
`
composer require laravel-admin-ext/narwhalformmedia
`

-- 发布静态资源
`php artisan vendor:publish --provider=Narwhal\FormMedia\FormMediaServiceProvider
`
