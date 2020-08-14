
(function () {

    function MediaYel(name,limit,rootpath,remove){
        this.warp = $(name)
        this.name = name;
        this.limit = limit;
        this.remove = remove;
        this.rootpath = rootpath;
        this.narwhal_crr_path = '/';
    }

    //初始化
    MediaYel.prototype.init = function(){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var _this = this;
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
            _this.changeImg(value_arr);
        }else{
            $('.narwhal_img_show_'+name).hide();
        }
        
    }

    // 初始化
    MediaYel.prototype.Run = function(){

        var _this = this;

        // 弹出图片选择器
        $('#NarwhalMediaModel'+_this.name).on('show.bs.modal', function (event) {
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

        //点击文件
        $("body").delegate(".thumbnail.narwhal_file_op"+_this.name,"click",function(){
            var data = $(this);
            var path = data.context.dataset.path;
            _this.getdata(path)

        });

        //点击nav
        $("body").delegate(".narwhal_nav_li"+_this.name,"click",function(){
            var data = $(this);
            var path = data.context.dataset.path;
            _this.getdata(path)
        });

        //新建文件
        $("body").delegate(".btn.btn-default.narwhal_dir_button_"+_this.name,'click',function(res){
            var dir = $("#narwhal_dir_input_"+_this.name).val();
            
            var form = new FormData();
            form.append("name",dir);
            form.append("dir",_this.narwhal_crr_path);
            form.append("_token",LA.token);
            $.ajax({
                type: 'post', // 提交方式 get/post
                url: '/admin/narwhalformmedia/newFolder', // 需要提交的 url
                data: form,
                processData: false,
                contentType : false,
                success: function(data){
                    if(data['code'] == 200){
                        toastr.success(data['msg']);
                        _this.getdata(_this.narwhal_crr_path)  //获取数据
                    }else{
                        toastr.error(data['msg']);
                    }
                },
                error: function(XmlHttpRequest, textStatus, errorThrown){
                    toastr.error('创建失败');
                }
            });
        });

        //上传图片
        $("body").delegate('.file-upload.narwhal_upload'+_this.name,'change', function(){
           var files = $(this).context.files;
           var form = new FormData();
           for (var i = 0; i < files.length; i++) {
               form.append("files[]", files[i]);
           }
           form.append("dir",_this.narwhal_crr_path);
           form.append("_token",LA.token);
           $.ajax({
                type: 'post', // 提交方式 get/post
                url: '/admin/narwhalformmedia/upload', // 需要提交的 url
                data: form,
                processData: false,
                contentType : false,
                success: function(data){
                    if(data['code'] == 200){
                        toastr.success(data['msg']);
                        _this.getdata(_this.narwhal_crr_path)  //获取数据
                    }else{
                        toastr.error(data['msg']);
                    }
                },
                error: function(XmlHttpRequest, textStatus, errorThrown){
                    toastr.error('上传失败');
                }
            });
        });

        // 提交按钮
        $("body").delegate('#narwhal_submit'+_this.name,'click',function(res){
            var limit = _this.limit;
            var name = _this.name;
            var rootpath = _this.rootpath;
            var remove = _this.remove
            // 提交按钮
            var url_list = [];
            var url_list_str = $('input[name='+name+']').val();
            if(url_list_str == '[]'){
                url_list_str = '';
            }
            if(url_list_str){
                if(limit == 1){
                    //去掉预览
                    _this.changeImg([])
                }else{
                    url_list = JSON.parse( url_list_str );
                }
                
            }
            var select_true_list = $('.narwhal_img_op'+name+'.narwhal_select_true');
            for (var i = 0; i < select_true_list.length; i++) {
                url_list.push(select_true_list[i].dataset.url);
            }

            url_list = _this.unique1(url_list);

            
            if(limit == 1){
                $('input[name='+name+']').val(url_list[0]);
                $('input[name='+name+']').attr("value",url_list[0]);
            }else{
                url_list_json = JSON.stringify( url_list );
                $('input[name='+name+']').val(url_list_json);
                $('input[name='+name+']').attr("value",url_list_json);
            }
            
            _this.changeImg(url_list)
            $('#NarwhalMediaModel'+_this.name).modal('hide');
        });


        //点击图片
        $("body").delegate(".narwhal_img_op"+_this.name,"click",function(){
            var limit = _this.limit;
            var name = _this.name;
            var rootpath = _this.rootpath;
            var remove = _this.remove

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
                        _this.narwhal_tip('选择图片不能超过 '+limit+' 张');
                        return 1;
                    }
                }
                $(this).addClass('narwhal_select_true');
            }
            return 1;
        });

        
        // 预览操作
        $("body").delegate(".narwhal_img_show_"+_this.name+"_item","click",function(){
            var url_list = [];
            var itemurl = $(this).context.dataset.url;
            var op = $(this).context.dataset.op;

            var limit = _this.limit;
            var name = _this.name;
            var rootpath = _this.rootpath;
            var remove = _this.remove

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
            if(inputs == '[]' || inputs  == '[""]'){
                inputs = '';
            }
            $('input[name='+name+']').val(inputs);
            _this.changeImg(new_url_list)
            return 1;
        });
    }

    //获取图片数据
    MediaYel.prototype.getdata = function(path = '/'){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var _this = this;
        $.ajax({
            method: 'GET',
            url: "/admin/narwhalformmedia/getfiledata?path="+path,
            datatype:'json',
            async: true,
            success: function (data) {
                $('#narwhal_body_table_'+_this.name).html('');
                for (i in data['list'])
                {
                    if(data['list'][i]['isDir']){
                        var htmltemp = '';
                        htmltemp += '<div class="col-xs-4 col-md-3">';
                        htmltemp +=     '<div class="thumbnail  narwhal_file_op'+name+'" data-path="/'+data['list'][i]['name']+'">';
                        htmltemp +=         data['list'][i]['preview'];
                        htmltemp +=         '<div class="file-info">';
                        htmltemp +=             '<a href="#" class="file-name" title="'+data['list'][i]['name']+'">'+data['list'][i]['namesmall']+'</a>';
                        htmltemp +=         '</div>';
                        htmltemp +=     '</div>';
                        htmltemp += '</div>';
                        $('#narwhal_body_table_'+_this.name).append(htmltemp);
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

                        $('#narwhal_body_table_'+_this.name).append(htmltemp);
                    }
                }
                $('#narwhal_nav_ol_'+_this.name).html('<li class="narwhal_nav_li'+name+'" data-path="/""><a href="#"><i class="fa fa-th-large"></i> </a></li>');
                for (var i = 0; i < data['nav'].length; i++) {
                    $('#narwhal_nav_ol_'+_this.name).append('<li><a class="narwhal_nav_li'+name+'" href="#" data-path="'+data['nav'][i]['url']+'"> '+data['nav'][i]['name']+'</a></li>');
                    _this.narwhal_crr_path = data['nav'][i]['url'];
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    // 弹窗
    MediaYel.prototype.narwhal_tip = function(title = '提示'){
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
    MediaYel.prototype.unique1 = function (arr){
      var hash=[];
      for (var i = 0; i < arr.length; i++) {
         if(hash.indexOf(arr[i])==-1){
          hash.push(arr[i]);
         }
      }
      return hash;
    }

    // 改变预览
    MediaYel.prototype.changeImg = function(url_list){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var _this = this;
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
    window.MediaYelDemo = MediaYel;
})();