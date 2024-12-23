document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // 确保图片加载完成后再执行
    const images = document.querySelectorAll('.zoomable img');
    let imagesLoaded = 0;

    images.forEach(img => {
        if (img.complete) {
            imagesLoaded++;
        } else {
            img.addEventListener('load', function () {
                imagesLoaded++;
                checkIfAllImagesLoaded();
            });
        }
    });

    function checkIfAllImagesLoaded() {
        if (imagesLoaded === images.length) {
            initializeZoom();
        }
    }

    // 如果所有图片都已经加载完成，则直接初始化
    if (imagesLoaded === images.length) {
        initializeZoom();
    }

    function initializeZoom() {
        // 获取所有可缩放的图片
        const zoomables = document.querySelectorAll('.zoomable img');

        // 动态创建遮罩层并插入到 body 中
        let zoomOverlay = document.querySelector('.zoom-overlay');
        if (!zoomOverlay) {
            zoomOverlay = document.createElement('div');
            zoomOverlay.classList.add('zoom-overlay');
            document.body.insertBefore(zoomOverlay, document.body.lastChild);
        }

        // 确保遮罩层元素存在
        if (!zoomOverlay) {
            console.error('Zoom overlay element not found.');
            return;
        }

        console.log('Found zoomable images:', zoomables);

        // 检查是否有可缩放的图片
        if (zoomables.length === 0) {
            console.warn('No zoomable images found.');
            return;
        }

        // 移除之前绑定的事件监听器
        function removeEventListeners() {
            const existingZoomables = document.querySelectorAll('.zoomable img');
            existingZoomables.forEach(img => {
                img.removeEventListener('click', handleImageClick);
            });
            document.removeEventListener('keydown', handleEscapeKey);
            zoomOverlay.removeEventListener('click', handleCloseOverlay);
        }

        // 绑定新的事件监听器
        function addEventListeners() {
            zoomables.forEach(img => {
                img.addEventListener('click', handleImageClick);
            });
            document.addEventListener('keydown', handleEscapeKey);
            zoomOverlay.addEventListener('click', handleCloseOverlay);
        }

        // 调用函数来移除旧的事件监听器并绑定新的
        removeEventListeners();
        addEventListeners();

        // 图片点击事件处理函数
        function handleImageClick(event) {
            event.preventDefault();
            event.stopPropagation(); // 阻止事件冒泡

            const img = event.target;

            // 检查图片是否已经放大
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
        }

        // Esc 键关闭图片放大
        function handleEscapeKey(event) {
            if (event.key === 'Escape' && document.body.classList.contains('zoom-overlay-active')) {
                const zoomedImages = document.querySelectorAll('.zoomable img.zoomed');
                zoomedImages.forEach(img => img.classList.remove('zoomed'));
                document.body.classList.remove('zoom-overlay-active');
            }
        }

        // 点击遮罩层关闭图片放大
        function handleCloseOverlay() {
            const zoomedImages = document.querySelectorAll('.zoomable img.zoomed');
            zoomedImages.forEach(img => img.classList.remove('zoomed'));
            document.body.classList.remove('zoom-overlay-active');
        }
    }
});