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
