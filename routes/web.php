<?php

use Narwhal\FormMedia\Http\Controllers\FormMediaController;

//获取文件
Route::any('narwhalformmedia/getfiledata', FormMediaController::class.'@getfiledata')->name('narwhalformmedia.getdate');
//上传图片
Route::post('narwhalformmedia/upload', FormMediaController::class.'@upload')->name('narwhalformmedia.upload');
Route::post('narwhalformmedia/newFolder', FormMediaController::class.'@newFolder')->name('narwhalformmedia.newFolder');