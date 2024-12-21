document.addEventListener('DOMContentLoaded', function() {
    // 初始化 lightGallery.js
    document.querySelectorAll('a[data-lightbox]').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();  // 阻止默认的链接跳转
            lightGallery.show(this);  // 手动触发 lightGallery.js 的显示
        });
    });

    lightGallery.init();

    // 初始化 magnify.js
    $(document).ready(function() {
        $('.magnify-image').magnify();
    });
});