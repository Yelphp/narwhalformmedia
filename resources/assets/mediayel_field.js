var getArgs=(function(){  

    var sc=document.getElementsByTagName('script'); 
    console.log(sc[sc.length-1].src.split('?'))

    var paramsArr_src = sc[sc.length-1].src.split('?')[1];

    console.log(paramsArr_src)

    var paramsArr=paramsArr_src.split('&');

   var args={},argsStr=[],param,t,name,value;  

    for(var ii=0,len=paramsArr.length;ii<len;ii++){  

            param=paramsArr[ii].split('=');  

            name=param[0],value=param[1];  

            if(typeof args[name]=="undefined"){ //参数尚不存在  

                args[name]=value;  

            }else if(typeof args[name]=="string"){ //参数已经存在则保存为数组  

                args[name]=[args[name]]  

                args[name].push(value);  

            }else{  //已经是数组的  

                args[name].push(value);  

            }  

    }
    return function(){return args;} //以json格式返回获取的所有参数  
})();

var scriptArg = getArgs();
console.log(scriptArg)
console.log(scriptArg['name'])
// console.log("username:"+getArgs()["s"]); 
var narwhal_crr_path = '/';

initShow(scriptArg['name']);

//初始化话预览值
function initShow(name){
    var limit = scriptArg['limit'];
    var name = scriptArg['name'];
    var rootpath = scriptArg['rootpath'];
    var remove = scriptArg['remove'];
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
    
// 弹出图片选择器
$('#NarwhalMediaModel').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    var title = button.data('title') //标题
    var name = button.data('name') //标题
    var modal = $(this)
    modal.find('.modal-title').text('请选择' + title)
    modal.find('.modal-body input').val(recipient)
    narwhal_image_submit_button(name);
    getdata('/',"/admin/narwhalformmedia/getfiledata",name)  //获取数据
})

// 提交按钮
$('#narwhal_submit_'+scriptArg['name']).on('click',function(res){
    var limit = scriptArg['limit'];
    var name = scriptArg['name'];
    var rootpath = scriptArg['rootpath'];
    var remove = scriptArg['remove'];
    // 提交按钮
    narwhal_sumbit_select_op(limit,names,rootpath,remove)
});


// 预览操作
$("body").delegate(".narwhal_img_show_"+scriptArg['name']+"_item","click",function(){
    var url_list = [];
    var itemurl = $(this).context.dataset.url;
    var op = $(this).context.dataset.op;

    var limit = scriptArg['limit'];
    var name = scriptArg['name'];
    var rootpath = scriptArg['rootpath'];
    var remove = scriptArg['remove'];

    var new_url_list = [];

    var url_list_str = $('input[name='+name+']').val();


    if(limit == 1){
        url_list.push(url_list_str);
    }else{
        url_list = JSON.parse( url_list_str );
    }

    if(op == 'delete'){
        //删除
        for (var i = 0; i < url_list.length ; i++) {
            if(url_list[i] != itemurl){
                new_url_list.push(url_list[i]);
            }
        }
    }else if(op == 'left'){
        //移动
        var key = 0;
        for (var i = 0; i < url_list.length ; i++) {
            if(url_list[i] == itemurl){
               key = i;
               break;
            }
        }
        new_url_list = url_list;
        var temp = new_url_list[key-1];
        new_url_list[key-1] = new_url_list[key];
        new_url_list[key] = temp;
    }else if(op == 'right'){
        //移动
        var key = 0;
        for (var i = 0; i < url_list.length ; i++) {
            if(url_list[i] == itemurl){
               key = i;
               break;
            }
        }
        new_url_list = url_list;
        var temp = new_url_list[key+1];
        new_url_list[key+1] = new_url_list[key];
        new_url_list[key] = temp;
    }else{
        return 0;
    }
    var inputs = JSON.stringify( new_url_list );
    if(inputs == '[]'){
        inputs = '';
    }
    $('input[name='+name+']').val(inputs);
    changeImg(new_url_list,name,limit,rootpath,remove)
    return 1;
});

//点击图片
$("body").delegate(".narwhal_img_op"+scriptArg['name'],"click",function(){
    var limit = scriptArg['limit'];
    var name = scriptArg['name'];
    var rootpath = scriptArg['rootpath'];
    var remove = scriptArg['remove'];

    var select_num_op = $('.narwhal_img_op'+name+'.narwhal_select_true');


    //现有多少张
    var now_num_val = $('input[name='+name+']').val();
    if(now_num_val == '[]'){
        now_num_val = '';
    }
    var now_num_arr = [];
    if(now_num_val){
        if(limit == 1){
            now_num_arr.push(now_num_val)
        }else{
            now_num_arr=JSON.parse( now_num_val );
        }
    }
    var now_num = now_num_arr.length;

    var select_num = now_num + select_num_op.length;

    var classlist = $(this).context.classList;
    
    var tag = false;
    for (var i = 0; i < classlist.length; i++) {
        if(classlist[i] == 'narwhal_select_true'){
            tag = true;
        }
    }
    if(tag){
        //取消选中
        $(this).removeClass('narwhal_select_true');
    }else{
        //选中
        if(limit == 1){
            //取消之前选中的
            $('.narwhal_select_true').removeClass('narwhal_select_true')

        }else{
            if(select_num >= limit){
                narwhal_tip('选择图片不能超过 '+limit+' 张');
                return 1;
            }
        }
        $(this).addClass('narwhal_select_true');
    }
    return 1;
});



// 上传图片
$('.file-upload.narwhal_upload_'+scriptArg['name']).on('change', function(){
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
                getdata(narwhal_crr_path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'])  //获取数据
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
$(".btn.btn-default.narwhal_dir_button"+scriptArg['name']).on('click',function(res){

    var dir = $(".form-control.pull-right.narwhal_dir_input"+scriptArg['name']).val();
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
                getdata(narwhal_crr_path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'])  //获取数据
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
    getdata(path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'])
});

//点击nav
$("body").delegate(".narwhal_nav_li","click",function(){
    var data = $(this);
    var path = data.context.dataset.path;
    getdata(path,"/admin/narwhalformmedia/getfiledata",scriptArg['name'])
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
function getdata(path = '/',url,name){
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
                        htmltemp +=     '<div class="thumbnail  narwhal_img_op'+name+'" data-url="'+data['list'][i]['name']+'">';
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


function narwhal_image_submit_button(name){
    $('#narwhal_image_submit').html(`
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button type="button" class="btn btn-primary" id='narwhal_submit_`+name+`'>确定</button>
    `);
}