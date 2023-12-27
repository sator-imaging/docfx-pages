function initializeAffix() {
    // affix is loaded on become visible
    const affixContainer = document.querySelector('body[data-yaml-mime=ApiPage] div.affix');
    if (!affixContainer)
        return;

    // badge for affix
    for (const affix of document.querySelectorAll('body[data-yaml-mime=ApiPage] div.affix .link-body-emphasis')) {
        if (affix.innerText.endsWith(' Deprecated')) {
            affix.innerText = affix.innerText.replace(/ Deprecated$/, '') + ' ';

            let badge = document.createElement('span');
            badge.innerText = '✖️';
            badge.classList.add("badge");
            badge.classList.add("text-bg-danger");
            badge.classList.add("rounded-pill");
            affix.appendChild(badge);
        }
    }

    window.removeEventListener("resize", initializeAffix);
}

window.addEventListener("resize", initializeAffix);
initializeAffix();


function initializePage(event) {
    // badge for api heading
    for (const apiTitle of document.querySelectorAll("h1.api")) {
        let badgeText = undefined;
        let isDeprecated = false;
        if (apiTitle.innerText.endsWith(' Deprecated')) {
            isDeprecated = true;
            apiTitle.innerText = apiTitle.innerText.replace(/ Deprecated$/, '');
        }

        if (apiTitle.dataset?.commentid?.at(1) == ':') {
            let pos = apiTitle.innerText.lastIndexOf(' ');
            if (pos >= 0) {
                badgeText = apiTitle.innerText.slice(0, pos);
                apiTitle.innerText = apiTitle.innerText.slice(pos + 1) + ' ';
                if (isDeprecated) {
                    badgeText = "Deprecated " + badgeText;
                }
            }
        }

        if (badgeText) {
            let badge = document.createElement('span');
            badge.innerText = badgeText;
            badge.classList.add("badge");
            if (isDeprecated) {
                badge.classList.add("text-bg-danger");
            } else {
                badge.classList.add("bg-info");
            }
            badge.classList.add("rounded-pill");
            apiTitle.appendChild(badge);
        }
    }
}

if (document.readyState == 'loading') {
    window.addEventListener("DOMContentLoaded", ev => initializePage(ev));
} else {
    initializePage(undefined);
}
