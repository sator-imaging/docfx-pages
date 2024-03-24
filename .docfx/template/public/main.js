function initializePage(event) {
    // TODO: do this by customizing template/partials.
    const stylingByScript = function () {
        // disable navbar submenu.
        for (const dropdown of document.querySelectorAll('.navbar .nav-item>.dropdown-toggle')) {
            dropdown.dataset.bsToggle = '';
            dropdown.classList.remove('dropdown-toggle');
            let href = location.pathname;
            const pos = href.indexOf('/', 1);
            if (pos >= 0) {
                href = href.slice(0, pos);
            }
            href = href.trimEnd('/');
            dropdown.href = href + '/api/index.html';
        }
    };
    // need delay
    setTimeout(stylingByScript, 64);
    setTimeout(stylingByScript, 128);
    setTimeout(stylingByScript, 1024);
}


if (document.readyState == 'loading') {
    window.addEventListener("DOMContentLoaded", ev => initializePage(ev));
} else {
    initializePage(undefined);
}
