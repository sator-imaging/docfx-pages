function initializeAffix() {
    const affixContainer = document.querySelector('div.affix');
    if (!affixContainer || (affixContainer.offsetWidth == 0 && affixContainer.offsetHeight == 0))
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
// need delay for affix async load
// run 3 different delays, no way to await unknown async jobs. this works enough.
setTimeout(initializeAffix, 64);
setTimeout(initializeAffix, 128);
setTimeout(initializeAffix, 1024);


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

    // api reference generator
    if (location.pathname.endsWith('/api/index.html') || location.pathname.endsWith('/api/')) {
        const tocRequest = new XMLHttpRequest();
        tocRequest.open('GET', '../toc.json');  // TODO: better way to find api/toc.json
        tocRequest.onload = function () {
            if (this.status != 200) {
                return;
            }

            tocData = JSON.parse(this.responseText);
            if (!tocData.items) {
                return;
            }

            const title = document.querySelector('article>h1');
            const article = title?.parentNode;
            if (!article) {
                return;
            }

            const nsTitle = document.createElement('h3');
            nsTitle.innerText = 'Namespaces';
            article.appendChild(nsTitle);

            const nsContent = document.createElement('p');
            article.appendChild(nsContent);

            for (const ns of tocData.items) {
                const div = document.createElement('div');
                const anchor = document.createElement('a');
                anchor.innerText = ns.name;
                anchor.href = ns.href;

                div.appendChild(anchor);
                nsContent.appendChild(div);
            }

            for (const ns of tocData.items) {
                if (!ns.items) {
                    continue;
                }

                const nsShort = document.createElement('h2');
                nsShort.innerText = new String(ns.name).search(/[^\.]+$/);
                article.appendChild(nsShort);

                const dl = document.createElement('dl');
                article.appendChild(dl);

                let dd = undefined;
                for (const obj of ns.items) {
                    if (!obj.href) {
                        const dt = document.createElement('dt');
                        dt.innerText = obj.name;
                        dd = document.createElement('dd');
                        dl.appendChild(dt);
                        dl.appendChild(dd);
                        continue;
                    }

                    if (!dd) {
                        continue;
                    }

                    const div = document.createElement('div');
                    const anchor = document.createElement('a');
                    anchor.innerText = obj.name;
                    anchor.href = obj.href;
                    div.appendChild(anchor);
                    dd.appendChild(div);
                }
            }
        }
    }

}


if (document.readyState == 'loading') {
    window.addEventListener("DOMContentLoaded", ev => initializePage(ev));
} else {
    initializePage(undefined);
}
