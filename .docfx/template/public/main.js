/*
function initializeAffix() {
    const affixContainer = document.querySelector('div.affix');
    if (!affixContainer || (affixContainer.offsetWidth == 0 && affixContainer.offsetHeight == 0))
        return;

    // badge for affix
    for (const affix of document.querySelectorAll('body[data-yaml-mime=ApiPage] div.affix a')) {
        if (affix.innerText.endsWith(' Deprecated')) {
            affix.innerText = affix.innerText.replace(/ Deprecated$/, '') + ' ';

            let badge = document.createElement('span');
            badge.innerText = '✖️';
            badge.classList.add("badge", "rounded-pill", "text-bg-danger");
            affix.appendChild(badge);
        }
    }

    window.removeEventListener("resize", initializeAffix);
}

window.addEventListener("resize", initializeAffix);
// need delay for affix async load
// run 3 different delays, no way to await unknown async jobs. this works enough.
setTimeout(initializeAffix, 64);
setTimeout(initializeAffix, 128);
setTimeout(initializeAffix, 1024);
*/

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
