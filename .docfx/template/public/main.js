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
            badge.classList.add("badge", "rounded-pill");
            if (isDeprecated) {
                badge.classList.add("text-bg-danger");
            } else {
                badge.classList.add("bg-info");
            }
            apiTitle.appendChild(badge);
        }
    }

    // api reference generator
    if (location.pathname.endsWith('/api/index.html') || location.pathname.endsWith('/api/')) {
        //console.info('api reference generator');

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

            const nsDL = document.createElement('dl');
            const nsDT = document.createElement('dt');
            const nsDD = document.createElement('dd');
            const nsTitle = document.createElement('h3');
            nsTitle.innerText = 'Namespaces';
            nsDT.appendChild(nsTitle);
            nsDL.appendChild(nsDT);
            nsDL.appendChild(nsDD);
            article.appendChild(nsDL);

            //console.info('api reference generator: build namespace contents');
            for (const ns of tocData.items) {
                if (!ns.items) {
                    continue;
                }

                const nsFullName = new String(ns.name);
                const nsID = nsFullName.replaceAll('.', '-').toLowerCase();

                //console.info('api reference generator: update namespace list');
                const nsDiv = document.createElement('div');
                const nsAnchor = document.createElement('a');
                nsAnchor.innerText = ns.name;
                nsAnchor.href = '#' + nsID;
                nsDiv.appendChild(nsAnchor);
                nsDD.appendChild(nsDiv);

                //console.info('api reference generator: add namespace heading');
                const nsShort = document.createElement('h2');
                nsShort.innerText = nsFullName.substring(nsFullName.search(/[^\.]+$/)) + ' ';
                nsShort.id = nsID;
                nsShort.classList.add('section', 'api');
                const nsBadge = document.createElement('span');
                nsBadge.innerText = 'Namespace';
                nsBadge.classList.add('badge', 'rounded-pill', 'bg-info');
                nsShort.appendChild(nsBadge);
                article.appendChild(nsShort);

                const nsDesc = document.createElement('p');
                const nsCode = document.createElement('code');
                nsCode.innerText = nsFullName;
                nsDesc.appendChild(nsCode);
                article.appendChild(nsDesc);

                const objDL = document.createElement('dl');
                article.appendChild(objDL);

                let members = undefined;
                for (const obj of ns.items) {
                    if (!obj.href) {
                        const category = document.createElement('dt');
                        category.innerText = obj.name;

                        members = document.createElement('dd');
                        objDL.appendChild(category);
                        objDL.appendChild(members);
                        continue;
                    }

                    if (!members) {
                        continue;
                    }

                    //console.info('api reference generator: add namespace content');
                    const div = document.createElement('div');
                    const anchor = document.createElement('a');
                    anchor.innerText = obj.name;
                    anchor.href = obj.href;
                    div.appendChild(anchor);
                    members.appendChild(div);
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

            //console.info('api reference generator: update breadcrumb')
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
