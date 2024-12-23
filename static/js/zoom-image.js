document.addEventListener('DOMContentLoaded', function () {
    const zoomables = document.querySelectorAll('.zoomable img');
    const zoomOverlay = document.querySelector('.zoom-overlay');

    // 确保遮罩层元素存在
    if (!zoomOverlay) {
        console.error('Zoom overlay element not found.');
        return;
    }

    zoomables.forEach(img => {
        img.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // 阻止事件冒泡

            // 检查图片是否已经缩放
            if (img.classList.contains('zoomed')) {
                // 还原图片
                img.classList.remove('zoomed');
                document.body.classList.remove('zoom-overlay-active');
            } else {
                // 放大图片前，先还原所有已放大的图片
                document.querySelectorAll('.zoomable img.zoomed').forEach(zoomedImg => {
                    zoomedImg.classList.remove('zoomed');
                });

                // 放大当前点击的图片
                img.classList.add('zoomed');
                document.body.classList.add('zoom-overlay-active');
            }
        });
    });

    // 点击遮罩层时关闭图片放大
    document.addEventListener('click', function (event) {
        if (event.target === zoomOverlay && document.body.classList.contains('zoom-overlay-active')) {
            const zoomedImages = document.querySelectorAll('.zoomable img.zoomed');
            zoomedImages.forEach(img => img.classList.remove('zoomed'));
            document.body.classList.remove('zoom-overlay-active');
        }
    });

    // 添加键盘事件监听器，用于通过Esc键关闭图片放大
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && document.body.classList.contains('zoom-overlay-active')) {
            const zoomedImages = document.querySelectorAll('.zoomable img.zoomed');
            zoomedImages.forEach(img => img.classList.remove('zoomed'));
            document.body.classList.remove('zoom-overlay-active');
        }
    });
});