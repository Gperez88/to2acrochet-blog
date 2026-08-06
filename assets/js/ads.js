// Ads components behavior: keeps --ads-sticky-height in sync with the real
// banner height (body padding + floating ad offset depend on it), handles
// the floating ad close tab (persisted for the session) and fires one
// adsbygoogle push per visible ad unit.
(function () {
    'use strict';

    var STORAGE_KEY = 'adsFloatingClosed';
    var sticky = document.getElementById('js-ads-sticky');
    var floating = document.getElementById('js-ads-floating');
    var floatingClose = document.getElementById('js-ads-floating-close');

    function syncStickyOffset() {
        var height = sticky ? sticky.offsetHeight : 0;
        document.documentElement.style.setProperty('--ads-sticky-height', height + 'px');
        document.body.classList.toggle('has-ads-sticky', height > 0);
    }

    // sessionStorage may be unavailable (privacy modes); fail open = ad visible
    function isFloatingClosed() {
        try {
            return sessionStorage.getItem(STORAGE_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function closeFloating() {
        floating.classList.add('is-closed');

        try {
            sessionStorage.setItem(STORAGE_KEY, '1');
        } catch (e) {}
    }

    function initAdUnits() {
        // Skip units inside a closed container: pushing to a hidden <ins>
        // makes AdSense throw availableWidth=0 errors
        var units = document.querySelectorAll('.ads-sticky .adsbygoogle, .ads-floating:not(.is-closed) .adsbygoogle');

        for (var i = 0; i < units.length; i++) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    if (floating) {
        if (isFloatingClosed()) {
            floating.classList.add('is-closed');
        }

        if (floatingClose) {
            floatingClose.addEventListener('click', closeFloating);
        }
    }

    syncStickyOffset();
    window.addEventListener('resize', syncStickyOffset);
    initAdUnits();
})();
