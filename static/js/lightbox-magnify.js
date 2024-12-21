document.addEventListener('DOMContentLoaded', function() {
    // 初始化 lightGallery.js
    lightGallery.init();

    // 初始化 magnify.js
    $(document).ready(function() {
        $('.magnify-image').magnify();
    });
});