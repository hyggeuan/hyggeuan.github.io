document.addEventListener('DOMContentLoaded', function() {
    // 阻止点击图片时的默认链接行为
    document.querySelectorAll('a[data-lightbox]').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();  // 阻止默认的链接跳转
            lightGallery.show(this);  // 手动触发 lightGallery.js 的显示
        });
    });

    // 初始化 lightGallery.js
    lightGallery.init();

    // 初始化 magnify.js
    $(document).ready(function() {
        $('.magnify').magnify();
    });
});