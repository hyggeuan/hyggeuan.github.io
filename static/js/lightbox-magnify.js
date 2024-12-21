document.addEventListener('DOMContentLoaded', function() {
    // 初始化 lightGallery.js
    lightGallery.init();

    // 使用 setTimeout 来确保 lightGallery.js 完成初始化后再初始化 magnify.js
    setTimeout(function() {
        $(document).ready(function() {
            $('.magnify').magnify();
        });
    }, 500); // 给 lightGallery.js 一些时间来完成其初始化

    // 禁用 magnify.js 的点击事件，避免与 lightGallery.js 冲突
    $.fn.magnify.defaults.clickToZoom = false;
});