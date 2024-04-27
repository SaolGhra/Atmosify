window.addEventListener('mousemove', function(event) {
    // Check if the device is a desktop
    if (window.innerWidth > 768 && !('ontouchstart' in window || navigator.maxTouchPoints)) {
        var header = document.querySelector('header');
        var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        if (event.clientY <= viewportHeight * 0.45) {
            header.style.top = '0';
        } else {
            header.style.top = '-50vh';
        }
    }
});