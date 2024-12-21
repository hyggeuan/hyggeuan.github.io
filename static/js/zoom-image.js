document.addEventListener('DOMContentLoaded', function () {
    const zoomables = document.querySelectorAll('.zoomable img');

    zoomables.forEach(img => {
        img.addEventListener('click', function (event) {
            event.preventDefault();

            // 检查图片是否已经缩放
            if (img.classList.contains('zoomed')) {
                // 还原图片
                img.classList.remove('zoomed');
                document.body.classList.remove('zoom-overlay-active');
            } else {
                // 放大图片
                img.classList.add('zoomed');
                document.body.classList.add('zoom-overlay-active');
            }
        });
    });

    // 点击背景时关闭图片放大
    document.addEventListener('click', function (event) {
        if (event.target.matches('.zoom-overlay')) {
            const zoomedImages = document.querySelectorAll('.zoomable img.zoomed');
            zoomedImages.forEach(img => img.classList.remove('zoomed'));
            document.body.classList.remove('zoom-overlay-active');
        }
    });
});
