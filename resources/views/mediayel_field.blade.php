
<div class="{{$viewClass['form-group']}} {!! !$errors->has($errorKey) ? '' : 'has-error' !!}">

    <label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>
    
    <div class="{{$viewClass['field']}}">

        <div class="narwhal_img_show narwhal_img_show_{{$name}}" style="display: none;">
            <div class="row narwhal_img_show_row_{{$name}}" >
            </div>
        </div>

        @include('admin::form.error')
        <div class="input-group">
            
            <input type="text" name="{{$name}}" class="form-control {{$class}}"  placeholder="{{ $placeholder }} "  {!! $attributes !!} value="{{ old($column, $value)?(is_array(old($column, $value))?json_encode(old($column, $value)):old($column, $value)):'' }}" />

            <div class="input-group-btn input-group-append">
                <div tabindex="500" class="btn btn-primary btn-file" type="button"  data-toggle="modal" data-target="#NarwhalMediaModel{{$name}}" data-title="{{$label}}" data-name="{{$name}}"  data-vaule="{{ old($column, $value)?(is_array(old($column, $value))?json_encode(old($column, $value)):old($column, $value)):'' }}"  data-limit="{{$limit}}" data-rootpath="{{$rootpath}}" data-remove="{{$remove}}" data-token="{{ csrf_token() }}">
                    <i class="glyphicon glyphicon-folder-open"></i>&nbsp;  
                    <span class="hidden-xs">浏览</span>
                </div>
            </div>

        </div><!-- /input-group -->
        @include('admin::form.help-block')
    </div>
</div>

<!-- 弹窗 -->
<div class="modal fade" id="NarwhalMediaModel{{$name}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
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
                    <input type="file"  class="hidden file-upload narwhal_upload{{$name}}" multiple="">
                </label>

                <div class="input-group input-group-sm pull-right goto-url" style="width: 250px;">
                    <input type="text" class="form-control pull-right narwhal_dir_input" id='narwhal_dir_input_{{$name}}' value="">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-default narwhal_dir_button_{{$name}}"><i class="fa fa-folder"></i>&nbsp;&nbsp;新建</button>
                    </div>
                </div>
            </div>

          <div class="modal-body pre-scrollable" >
            <!-- 页面导航 -->
            <ol class="breadcrumb" style="margin-bottom: 10px;" id="narwhal_nav_ol_{{$name}}">
            </ol>
                <!-- 图片 -->
                <div class="row" id='narwhal_body_table_{{$name}}'>
                    <!-- js 加载 -->
                </div>
            </div>

            <div class="modal-footer" id="narwhal_image_submit">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary" id='narwhal_submit{{$name}}'>确定</button>
            </div>
        </div>
    </div>
</div>
