# Laravar-admin 图片管理拓展

![图片名称](https://laravel-admin.org/storage/2020/08/15/7ZaxPdSjvZY7h0zTnwtJWp1aDLmcotlaPYcyHSbs.png)

## 依赖

| php   >=7.0.0 
| laravel-admin   >=~1.6 

## 安装

### composer 安装

```
composer require yelphp/narwhalformmedia
```


### 发布资源

```
php artisan vendor:publish --provider=Narwhal\FormMedia\FormMediaServiceProvider
```

## 使用

#### 单图 数据库结构 varchar

##### 可删除

```
$form->photo('photo','图片')->limit(1)->remove(true)->help('单图，不可删除可删除');
```

##### 不可删除

```
$form->photo('photo','图片')->limit(1)->remove(false)->help('单图，不可删除可删除');

$form->photo('photo','图片')->limit(1)->help('单图，可删除');
```

#### 多图 数据库结构 json

```
$form->photos('photo','图片')->limit(9)->remove(true);  //可删除

```

#### 视频 数据库结构 json/varchar

```
$form->video('video','视频')->limit(9)->remove(true);  //可删除

```

### 参数说明
```
limit(int)      ： 图片限制条数
remove(boolean) :  是否有删除按钮   

photo 、 photos 、 video  的 参数默认值不一样

photo  默认 limit = 1  remove = false

photos 默认 limit = 9  remove = true

video  默认 limit = 1  remove = true
```


###### 多 图\视频 上传提交的数据为 json 字符串，如需输出数组，请在对应模型中加入下面代码
```
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demo extends Model
{
	
	public function getPicturesAttribute($pictures)
	{

	    return json_decode($pictures, true);

	}

}
```
