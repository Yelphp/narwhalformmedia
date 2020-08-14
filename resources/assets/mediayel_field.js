
var scriptArg = [];
scriptArg['limit'] = 1;
scriptArg['name'] = '';
scriptArg['rootpath'] = '';
scriptArg['remove'] = false;
scriptArg['token'] = '';

var narwhal_crr_path = '/';



//初始化话预览值
function initShow(name,limit,remove,rootpath,token){

    scriptArg['limit'] = limit;
    scriptArg['name'] = name;
    scriptArg['rootpath'] = rootpath;
    scriptArg['remove'] = remove;
    scriptArg['token'] = token;

    var value = $('input[name='+name+']').val();

    var value_arr = [];
    if(value){
        if(limit == 1){
            if(value != '[]' && value != ''){
                value_arr.push(value)
            }
        }else{
            value_arr=JSON.parse(value);
        }
        changeImg(value_arr,name,limit,rootpath,remove);
    }else{
        $('.narwhal_img_show_'+name).hide();
    }
}
    


// 提交按钮
$('#narwhal_submit').on('click',function(res){
    var limit = scriptArg['limit'];
    var name = scriptArg['name'];
    var rootpath = scriptArg['rootpath'];
    var remove = scriptArg['remove'];
    // 提交按钮
    narwhal_sumbit_select_op(limit,name,rootpath,remove)
});


// 上传图片
$('.file-upload.narwhal_upload').on('change', function(){
   var files = $(this).context.files;
   var form = new FormData();
   for (var i = 0; i < files.length; i++) {
       form.append("files[]", files[i]);
   }
   form.append("dir",narwhal_crr_path);
   form.append("_token",scriptArg['token']);
   $.ajax({
        type: 'post', // 提交方式 get/post
        url: '/admin/narwhalformmedia/upload', // 需要提交的 url
        data: form,
        processData: false,
        contentType : false,
        success: function(data){
            if(data['code'] == 200){
                toastr.success(data['msg']);
                getdata(narwhal_crr_path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'],scriptArg)  //获取数据
            }else{
                toastr.error(data['msg']);
            }
        },
        error: function(XmlHttpRequest, textStatus, errorThrown){
            toastr.error('上传失败');
        }
    });
});

 //新建文件夹
$(".btn.btn-default.narwhal_dir_button").on('click',function(res){

    var dir = $(".form-control.pull-right.narwhal_dir_input").val();
    var form = new FormData();
    form.append("name",dir);
    form.append("dir",narwhal_crr_path);
    form.append("_token",scriptArg['token']);

    $.ajax({
        type: 'post', // 提交方式 get/post
        url: '/admin/narwhalformmedia/newFolder', // 需要提交的 url
        data: form,
        processData: false,
        contentType : false,
        success: function(data){
            if(data['code'] == 200){
                toastr.success(data['msg']);
                getdata(narwhal_crr_path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'],scriptArg)  //获取数据
            }else{
                toastr.error(data['msg']);
            }
        },
        error: function(XmlHttpRequest, textStatus, errorThrown){
            toastr.error('创建失败');
        }
    });

});


//点击文件
$("body").delegate(".thumbnail.narwhal_file_op","click",function(){
    var data = $(this);
    var path = data.context.dataset.path;


    getdata(path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'],scriptArg)
});

//点击nav
$("body").delegate(".narwhal_nav_li","click",function(){
    var data = $(this);
    var path = data.context.dataset.path;
    getdata(path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'],scriptArg)
});



function narwhal_tip(title = '提示'){
    swal({
        title: title,
        type: "warning",
        showCancelButton: false,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        showLoaderOnConfirm: false,
        closeOnConfirm: false,
        cancelButtonText: "取消",
    });
}

//数组去重
function unique1(arr){
  var hash=[];
  for (var i = 0; i < arr.length; i++) {
     if(hash.indexOf(arr[i])==-1){
      hash.push(arr[i]);
     }
  }
  return hash;
}


// 改变预览
function changeImg(url_list , name, limit , rootpath,remove){
    console.log()
    $(".narwhal_img_show_row_"+name).html('');
    if(url_list.length > 0){
        $('.narwhal_img_show_'+name).show();
    }else{
        $('.narwhal_img_show_'+name).hide();
    }
    
    for (var i = 0; i < url_list.length; i++) {
        var html = '';
        html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-3"><div class="thumbnail narwhal_row_col"><img width="100%" max-height="160px" src="'+rootpath+url_list[i]+'" alt="'+rootpath+url_list[i]+'"><div class="caption">';
        if(remove){
            html += '<a type="button" class="btn btn-default btn file-delete-multiple narwhal_img_show_'+name+'_item" data-url="'+url_list[i]+'" data-op="delete" title="删除"><i class="fa fa-trash-o"></i></a>';
        }
        if(i != 0){
            html += '<a type="button" class="btn btn-default btn file-delete-multiple narwhal_img_show_'+name+'_item" data-url="'+url_list[i]+'" data-op="left" title="左"><i class="fa fa-arrow-left"></i></a>';
        }
        if(i != url_list.length -1){
            html += '<a type="button" class="btn btn-default btn file-delete-multiple narwhal_img_show_'+name+'_item" data-url="'+url_list[i]+'" data-op="right" title="右"><i class="fa fa-arrow-right"></i></a>';
        }
        $(".narwhal_img_show_row_"+name).append(html+'</div></div></div>');
    }
}

// 获取图片数据
function getdata(path = '/',url,name, scriptArgs){
    scriptArg['limit'] = scriptArgs['limit'];
    scriptArg['name'] = scriptArgs['name'];
    scriptArg['rootpath'] = scriptArgs['rootpath'];
    scriptArg['remove'] = scriptArgs['remove'];
    scriptArg['token'] = scriptArgs['token'];

    $.ajax({
        method: 'GET',
        url: url+"?path="+path,
        datatype:'json',
        async: true,
        success: function (data) {
            $('#narwhal_body_table').html('');
            for (i in data['list'])
            {
                if(data['list'][i]['isDir']){
                    var htmltemp = '';
                    htmltemp += '<div class="col-xs-4 col-md-3">';
                    htmltemp +=     '<div class="thumbnail  narwhal_file_op" data-path="/'+data['list'][i]['name']+'">';
                    htmltemp +=         data['list'][i]['preview'];
                    htmltemp +=         '<div class="file-info">';
                    htmltemp +=             '<a href="#" class="file-name" title="'+data['list'][i]['name']+'">'+data['list'][i]['namesmall']+'</a>';
                    htmltemp +=         '</div>';
                    htmltemp +=     '</div>';
                    htmltemp += '</div>';
                    $('#narwhal_body_table').append(htmltemp);
                }else{
                    var htmltemp = '';
                    htmltemp += '<div class="col-xs-4 col-md-3">';
                    
                    if(data['list'][i]['type'] == 'image'){
                        htmltemp +=     '<div class="thumbnail  narwhal_img_op'+scriptArg['name']+'" data-url="'+data['list'][i]['name']+'">';
                    }else{
                        htmltemp +=    '<div class="thumbnail " data-url="'+data['list'][i]['name']+'">';
                    }
                    htmltemp +=         data['list'][i]['preview'];
                    htmltemp +=         '<div class="file-info">';
                    htmltemp +=             '<a href="#" class="file-name" title="'+data['list'][i]['name']+'">'+data['list'][i]['namesmall']+'</a>';
                    htmltemp +=         '</div>';
                    htmltemp +=     '</div>';
                    htmltemp += '</div>';

                    $('#narwhal_body_table').append(htmltemp);
                }
            }

            $('#narwhal_nav_ol').html('<li class="narwhal_nav_li" data-path="/""><a href="#"><i class="fa fa-th-large"></i> </a></li>');
            for (var i = 0; i < data['nav'].length; i++) {
                $('#narwhal_nav_ol').append('<li><a class="narwhal_nav_li" href="#" data-path="'+data['nav'][i]['url']+'"> '+data['nav'][i]['name']+'</a></li>');
                narwhal_crr_path = data['nav'][i]['url'];
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

// 提交按钮
function narwhal_sumbit_select_op(limit,names,rootpath,remove){
    var url_list = [];
    var url_list_str = $('input[name='+names+']').val();
    if(url_list_str == '[]'){
        url_list_str = '';
    }
    if(url_list_str){
        if(limit == 1){
            //去掉预览
            changeImg([],names,limit,rootpath,remove)
        }else{
            url_list = JSON.parse( url_list_str );
        }
        
    }
    var select_true_list = $('.narwhal_select_true');
    for (var i = 0; i < select_true_list.length; i++) {
        url_list.push(select_true_list[i].dataset.url);
    }

    url_list = unique1(url_list);

    
    if(limit == 1){
        $('input[name='+names+']').val(url_list[0]);
        $('input[name='+names+']').attr("value",url_list[0]);
    }else{
        url_list_json = JSON.stringify( url_list );
        $('input[name='+names+']').val(url_list_json);
        $('input[name='+names+']').attr("value",url_list_json);
    }
    
    changeImg(url_list,names,limit,rootpath,remove)
    $('#NarwhalMediaModel').modal('hide');
}
