export default {
    defaultTheme: 'light',
    showLightbox: (img) => true,
    iconLinks: [
        {
            icon: 'github',
            href: 'https://github.com/sator-imaging',
            title: 'GitHub'
        },
        {
            icon: 'twitter',
            href: 'https://twitter.com/sator_imaging',
            title: 'Twitter'
        },
        {
            icon: 'youtube',
            href: 'https://www.youtube.com/@SatorImaging',
            title: 'YouTube'
        },
        {
            icon: 'chat-quote-fill',
            href: 'https://www.sator-imaging.com/',
            title: 'Contact'
        },
    ],
}


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
            let pos = apiTitle.innerText.indexOf(' ');
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

    setTimeout(() => {
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

        // toc auto expand
        for (const elm of document.querySelectorAll("nav.toc>*>ul>li>ul>li")) {
            elm.classList.add("expanded");
        }
    }, 256);
}

if (document.readyState == 'loading') {
    window.addEventListener("DOMContentLoaded", ev => initializePage(ev));
} else {
    initializePage(undefined);
}
