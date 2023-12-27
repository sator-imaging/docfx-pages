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
        console.info('api reference generator');

        const tocRequest = new XMLHttpRequest();
        tocRequest.open('GET', '../api/toc.json');  // TODO: better way to find api/toc.json
        tocRequest.onload = function () {
            if (this.status != 200) {
                console.error('api reference generator: url not found');
                return;
            }

            const tocData = JSON.parse(this.responseText);
            if (!tocData.items) {
                console.error('api reference generator: no toc');
                return;
            }

            const title = document.querySelector('article>h1');
            const article = title?.parentNode;
            if (!article) {
                console.error('api reference generator: no article element');
                return;
            }

            const nsTitle = document.createElement('h3');
            nsTitle.innerText = 'Namespaces';
            article.appendChild(nsTitle);

            const nsContent = document.createElement('p');
            article.appendChild(nsContent);

            console.info('api reference generator: build namespace list');
            for (const ns of tocData.items) {
                const div = document.createElement('div');
                const anchor = document.createElement('a');
                anchor.innerText = ns.name;
                anchor.href = ns.href;

                div.appendChild(anchor);
                nsContent.appendChild(div);
            }

            console.info('api reference generator: build namespace contents');
            for (const ns of tocData.items) {
                if (!ns.items) {
                    continue;
                }

                const nsFullName = new String(ns.name);
                const nsShort = document.createElement('h2');
                nsShort.innerText = nsFullName.substring(nsFullName.search(/[^\.]+$/));
                article.appendChild(nsShort);

                const nsDesc = document.createElement('p');
                const nsCode = document.createElement('code');
                nsCode.innerText = nsFullName;
                nsDesc.appendChild(nsCode);
                article.appendChild(nsDesc);

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

                    console.info('api reference generator: build namespace content item');
                    const div = document.createElement('div');
                    const anchor = document.createElement('a');
                    anchor.innerText = obj.name;
                    anchor.href = obj.href;
                    div.appendChild(anchor);
                    dd.appendChild(div);
                }
            }
        }

        tocRequest.send();

        document.body.dataset.yamlMime = 'ApiPage';

        // breadcrumb is dynamically created. delay required.
        const updateBreadcrumb = function () {
            const breadcrumb = document.querySelector('nav .breadcrumb');
            if (!breadcrumb || breadcrumb.childElementCount == 0 || breadcrumb.childElementCount > 1) {
                return;
            }

            console.info('api reference generator: update breadcrumb')
            const li = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.innerText = 'API';
            anchor.href = 'index.html';
            li.appendChild(anchor);
            breadcrumb.appendChild(li);
        };
        setTimeout(updateBreadcrumb, 64);
        setTimeout(updateBreadcrumb, 128);
        setTimeout(updateBreadcrumb, 1024);
    }

}


if (document.readyState == 'loading') {
    window.addEventListener("DOMContentLoaded", ev => initializePage(ev));
} else {
    initializePage(undefined);
}
