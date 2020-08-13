
<div class="{{$viewClass['form-group']}} {!! !$errors->has($errorKey) ? '' : 'has-error' !!}">

    <label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>
    
    <div class="{{$viewClass['field']}}">

        <div class="narwhal_img_show narwhal_img_show_{{$name}}" style="display: none;">
            <div class="row narwhal_img_show_row_{{$name}}" >
            </div>
        </div>

    	@include('admin::form.error')

        <div class="input-group">
	      	<input type="text" name="{{$name}}" class="form-control {{$class}}"  placeholder="{{ $placeholder }} "  {!! $attributes !!} value="{{ old($column, $value) }}" />

	      	<div class="input-group-btn input-group-append">
			    <div tabindex="500" class="btn btn-primary btn-file" type="button"  data-toggle="modal" data-target="#NarwhalMediaModel" data-title="{{$label}}" data-name="{{$name}}"  data-vaule="{{ old($column, $value) }}"  data-whatever="@mdo">
			    	<i class="glyphicon glyphicon-folder-open"></i>&nbsp;  
			    	<span class="hidden-xs">浏览</span>
			    </div>
			</div>

	    </div><!-- /input-group -->
	    @include('admin::form.help-block')
    </div>
</div>

<!-- 弹窗 -->
<div class="modal fade" id="NarwhalMediaModel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel{{$name}}">
    <div class="modal-dialog" role="document">
        <div class="modal-content"  style="width: 100%">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="exampleModalLabel{{$name}}">选择图片</h4>
          </div>
          <div class="mailbox-controls with-border" style="margin-left: 10px;">
                <!-- /.btn-group -->
                <label class="btn btn-default btn">
                    <i class="fa fa-upload"></i>&nbsp;&nbsp;上传
                    <input type="file"  class="hidden file-upload narwhal_upload_{{$name}}" multiple="">
                </label>

                <div class="input-group input-group-sm pull-right goto-url" style="width: 250px;">
                    <input type="text" class="form-control pull-right narwhal_dir_input{{$name}}" value="">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-default narwhal_dir_button{{$name}}"><i class="fa fa-folder"></i>&nbsp;&nbsp;新建</button>
                    </div>
                </div>
            </div>

          <div class="modal-body pre-scrollable" >
          	<!-- 页面导航 -->
          	<ol class="breadcrumb" style="margin-bottom: 10px;" id="narwhal_nav_ol">
            </ol>
                <!-- 图片 -->
                <div class="row" id='narwhal_body_table'>
        		    <!-- js 加载 -->
    		    </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary" id='narwhal_submit'>确定</button>
            </div>

            <!-- 临时值 -->
            <div style="display: none;" id="narwhal_data_name_{{$name}}"></div>
        </div>
    </div>
</div>

<script type="text/javascript" src="http://chaowei.data.com/vendor/laravel-admin-ext/narwhalformmedia/mediayel_field.js"></script>
<script type="text/javascript">
 
    var narwhal_crr_path = '/';

    initShow('{{$name}}');

    //初始化话预览值
    function initShow(name){
        var value = $('input[name='+name+']').val();
        var limit = {{$limit}};
        var name = '{{$name}}';
        var rootpath = '{{$rootpath}}';
        var remove = {{$remove}}+'';
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
            $('.narwhal_img_show_{{$name}}').hide();
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
        modal.find("#narwhal_data_name_{{$name}}").html(name)
        getdata('/',"{{ url('/admin/narwhalformmedia/getfiledata') }}",name)  //获取数据
    })

    // 提交按钮
    $('#narwhal_submit').on('click',function(res){
        var url_list = [];
        var limit = {{$limit}};
        var names = '{{$name}}';
        var rootpath = '{{$rootpath}}';
        var remove = {{$remove}}+'';

        var name = $('#narwhal_data_name_{{$name}}').text();

        var url_list_str = $('input[name='+name+']').val();
        if(url_list_str == '[]'){
            url_list_str = '';
        }
        if(url_list_str){
            if(limit == 1){
                //去掉预览
                changeImg([],names,limit,rootpath,remove)
            }else{
                url_list=JSON.parse( url_list_str );
            }
            
        }
        var select_true_list = $('.narwhal_select_true');
        for (var i = 0; i < select_true_list.length; i++) {
            url_list.push(select_true_list[i].dataset.url);
        }

        url_list = unique1(url_list);

        
        if(limit == 1){
            $('input[name='+name+']').attr("value",url_list[0]);
        }else{
            url_list_json = JSON.stringify( url_list );
            $('input[name='+name+']').attr("value",url_list_json);
        }
        
        changeImg(url_list,names,limit,rootpath,remove)
        $('#NarwhalMediaModel').modal('hide');
    });

 
    // 预览操作
    $("body").delegate(".narwhal_img_show_{{$name}}_item","click",function(){
        var url_list = [];
        var itemurl = $(this).context.dataset.url;
        var op = $(this).context.dataset.op;

        var new_url_list = [];

        var url_list_str = $('input[name={{$name}}]').val();

        var limit = {{$limit}};
        var name = '{{$name}}';
        var rootpath = '{{$rootpath}}';
        var remove = {{$remove}}+'';

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
        $('input[name={{$name}}]').val(inputs);
        changeImg(new_url_list,names,limit,rootpath,remove)
        return 1;
    });

    //点击图片
    $("body").delegate(".narwhal_img_op{{$name}}","click",function(){
        var select_num_op = $('.narwhal_img_op{{$name}}.narwhal_select_true');
        var limit = {{$limit}};

        //现有多少张
        var now_num_val = $('input[name="{{$name}}"]').val();
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
                    narwhal_tip('选择图片不能超过 {{$limit}} 张');
                    return 1;
                }
            }
            $(this).addClass('narwhal_select_true');
        }
        return 1;
    });

    // 上传图片
    $('.file-upload.narwhal_upload_{{$name}}').on('change', function(){
       var files = $(this).context.files;
       var form = new FormData();
       for (var i = 0; i < files.length; i++) {
           form.append("files[]", files[i]);
       }
       form.append("dir",narwhal_crr_path);
       form.append("_token","{{ csrf_token() }}");
       $.ajax({
            type: 'post', // 提交方式 get/post
            url: '/admin/narwhalformmedia/upload', // 需要提交的 url
            data: form,
            processData: false,
            contentType : false,
            success: function(data){
                if(data['code'] == 200){
                    toastr.success(data['msg']);
                    getdata(narwhal_crr_path,"{{ url('/admin/narwhalformmedia/getfiledata') }}","{{$name}}")  //获取数据
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
    $(".btn.btn-default.narwhal_dir_button{{$name}}").on('click',function(res){
        var dir = $(".form-control.pull-right.narwhal_dir_input{{$name}}").val();
        var form = new FormData();
        form.append("name",dir);
        form.append("dir",narwhal_crr_path);
        form.append("_token","{{ csrf_token() }}");

        $.ajax({
            type: 'post', // 提交方式 get/post
            url: '/admin/narwhalformmedia/newFolder', // 需要提交的 url
            data: form,
            processData: false,
            contentType : false,
            success: function(data){
                if(data['code'] == 200){
                    toastr.success(data['msg']);
                    getdata(narwhal_crr_path,"{{ url('/admin/narwhalformmedia/getfiledata') }}","{{$name}}")  //获取数据
                }else{
                    toastr.error(data['msg']);
                }
            },
            error: function(XmlHttpRequest, textStatus, errorThrown){
                toastr.error('创建失败');
            }
        });

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

    //点击文件
    $("body").delegate(".thumbnail.narwhal_file_op","click",function(){
        var data = $(this);
        var path = data.context.dataset.path;
        getdata(path,"{{ url('/admin/narwhalformmedia/getfiledata') }}","{{$name}}")
    });

    //点击nav
    $("body").delegate(".narwhal_nav_li","click",function(){
        var data = $(this);
        var path = data.context.dataset.path;
        getdata(path,"{{ url('/admin/narwhalformmedia/getfiledata') }}","{{$name}}")
    });

</script>

