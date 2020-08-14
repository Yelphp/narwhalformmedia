
<?php
    $request = \Request::instance();
    if ($request->headers->has("X-PJAX")) {
        $request->headers->set("X-PJAX", false);
    }
?>

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
                <div tabindex="500" class="btn btn-primary btn-file" type="button"  data-toggle="modal" data-target="#NarwhalMediaModel" data-title="{{$label}}" data-name="{{$name}}"  data-vaule="{{ old($column, $value) }}"  data-limit="{{$limit}}" data-rootpath="{{$rootpath}}" data-remove="{{$remove}}" data-token="{{ csrf_token() }}">
                    <i class="glyphicon glyphicon-folder-open"></i>&nbsp;  
                    <span class="hidden-xs">浏览</span>
                </div>
            </div>

        </div><!-- /input-group -->
        @include('admin::form.help-block')
    </div>
</div>

<!-- 弹窗 -->
<div class="modal fade" id="NarwhalMediaModel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content"  style="width: 100%">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="exampleModalLabel">选择图片</h4>
          </div>
          <div class="mailbox-controls with-border" style="margin-left: 10px;">
                <!-- /.btn-group -->
                <label class="btn btn-default btn">
                    <i class="fa fa-upload"></i>&nbsp;&nbsp;上传
                    <input type="file"  class="hidden file-upload narwhal_upload" multiple="">
                </label>

                <div class="input-group input-group-sm pull-right goto-url" style="width: 250px;">
                    <input type="text" class="form-control pull-right narwhal_dir_input" value="">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-default narwhal_dir_button"><i class="fa fa-folder"></i>&nbsp;&nbsp;新建</button>
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

            <div class="modal-footer" id="narwhal_image_submit">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary" id='narwhal_submit'>确定</button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="{{ env('APP_URL') }}/vendor/yelphp/narwhalformmedia/mediayel_field.js"></script>

<script type="text/javascript">

    initShow('{{$name}}',{{$limit}},{{$remove}}+'',"{{$rootpath}}",'{{ csrf_token() }}');

    // 弹出图片选择器
    $('#NarwhalMediaModel').on('show.bs.modal', function (event) {

        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        var title = button.data('title') //标题
        var name = button.data('name') //标题
        var limit = button.data('limit') //标题
        var remove = button.data('remove') //标题
        var rootpath = button.data('rootpath') //标题
        var token = button.data('token') //标题

        scriptArg['limit'] = limit;
        scriptArg['name'] = name;
        scriptArg['rootpath'] = rootpath;
        scriptArg['remove'] = remove;
        scriptArg['token'] = token;

        var modal = $(this)
        modal.find('.modal-title').text('请选择' + title)
        modal.find('.modal-body input').val(recipient)
        getdata('/',"/admin/narwhalformmedia/getfiledata",name,scriptArg)  //获取数据
    })

    //点击图片
    $("body").delegate(".narwhal_img_op"+"{{$name}}","click",function(){
        var limit = {{$limit}};
        var name ='{{$name}}';
        var rootpath = '{{$rootpath}}';

        var remove = {{$remove}}+'';

        console.log(name)

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

    // 预览操作
    $("body").delegate(".narwhal_img_show_"+"{{$name}}"+"_item","click",function(){
        var url_list = [];
        var itemurl = $(this).context.dataset.url;
        var op = $(this).context.dataset.op;

        var limit = {{$limit}};
        var name ='{{$name}}';
        var rootpath = '{{$rootpath}}';
        var remove = {{$remove}}+'';

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
        console.log(new_url_list);
        var inputs = JSON.stringify( new_url_list );
        if(inputs == '[]' || inputs  == '[""]'){
            inputs = '';
        }
        $('input[name='+name+']').val(inputs);
        changeImg(new_url_list,name,limit,rootpath,remove)
        return 1;
    });
</script>

