# qc-tinymce-use
富文本编辑器vue-tinymce的配置使用，加了图文配置、视频配置，视频查看时在预览里


# run 
```
yarn install

yarn serve

```

# des

```
Pre：
vue-tinymce ：对tinymce的vue封装
安装：
npm i vue-tinymce
or
yarn add vue-tinymce


1.main.js

import VueTinymce from "@packy-tang/vue-tinymce"

2.page里：

<vue-tinymce
    v-model="content"
    :setup="setup"
    :setting="setting"
    @change="changeClick($event)"
    />		

配置相关主要是在setting里，可以具体看和修改

3.相关静态资源

相关静态资源放在了
-static
--tinymce
文件夹下
里面有tinymce需要的图片和下载的语言包


4.汉化

setting里需要配置两项，注意只单独配置一项不起作用

language_url: '../../static/tinymce/langs/zh_CN.js',
language: 'zh_CN', //以上两者都需要配置


5.添加图片

添加图片除了需要在toolbar和plugins里边添加image外
最主要就是一个配置函数
images_upload_handler: (blobInfo, success, failure) => {}
具体可以看实现


6.添加视频

添加视频也是需要在toolbar和plugins里添加media
再配置一个：
file_picker_types: 'media',
然后就是配置函数：
file_picker_callback: function(cb, value, meta) {}

有了上述配置编辑器视频会有一个上传入口，然后我们需要自己再回调方法
file_picker_callback中再人为创建一个input来人为打开本地文件夹


file_picker_callback: function(cb, value, meta) {
					
    if (meta.filetype == 'media'){
        //创建一个隐藏的type=file的文件选择input，用这个去实现上传逻辑
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'video/*');
        //input选中
        input.onclick=function(e){..}
    }
    ...
}

PS:
视频本地上传之后，编辑器里边显示的只是一个img占位element
具体查看需要点击眼睛图标预览


```


