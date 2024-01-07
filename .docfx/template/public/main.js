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

    // TODO: do this by customizing template/partials.
    const stylingByScript = function () {
        // inherited members list is too long. hide it by default.
        for (const inheritedMembers of document.querySelectorAll("#inherited-members")) {
            const list = inheritedMembers.nextSibling;
            if (!list?.classList?.contains('typelist'))
                continue;

            const details = document.createElement('details');
            inheritedMembers.parentNode.insertBefore(details, list);
            details.appendChild(list);
        }

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

        // toc bottom link
        const tocBottomID = 'stmg-toc-bottom';
        let tocBottom = document.querySelector('#' + tocBottomID);
        if (!tocBottom) {
            for (const navToc of document.querySelectorAll("nav#toc")) {
                tocBottom = document.createElement('div');
                tocBottom.id = tocBottomID;
                tocBottom.classList.add('mb-1', 'small');
                tocBottom.innerHTML = 'Go <a href="https://github.com/sator-imaging/docfx-pages">docfx-pages</a>';
                // additional delay to prevent inserted before toc list
                setTimeout(() => navToc.appendChild(tocBottom), 1024);
                tocBottom.style.order = 310;  // always last by css style
            }
        }
    };
    // need delay
    setTimeout(stylingByScript, 64);
    setTimeout(stylingByScript, 128);
    setTimeout(stylingByScript, 1024);

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
            article.appendChild(nsDL);

            const affixDiv = document.querySelector('#affix');
            if (affixDiv) {
                const affixHeading = document.createElement('h5');
                affixHeading.innerText = 'Namespaces';
                affixHeading.classList.add('border-bottom');
                affixDiv.appendChild(affixHeading);
            }

            //console.info('api reference generator: build namespace contents');
            for (const ns of tocData.items) {
                if (!ns.items) {
                    continue;
                }

                let nsFullName = new String(ns.name);
                if (!nsFullName) {
                    nsFullName = 'Global';
                }
                let nsParentName = 'Global';
                let nsShortName = 'Global';
                const nsPos = nsFullName.lastIndexOf('.');
                if (nsPos >= 0) {
                    nsParentName = nsFullName.slice(0, nsPos);
                    nsShortName = nsFullName.substring(nsPos + 1);
                }
                const nsParentID = nsParentName.replaceAll('.', '-').toLowerCase();
                const nsID = nsFullName.replaceAll('.', '-').toLowerCase();
                nsParentName = nsParentName.replaceAll('.', ' > ');

                let affixUL = affixDiv?.querySelector('#' + nsParentID);
                if (!affixUL && affixDiv) {
                    affixUL = document.createElement('ul');
                    affixUL.id = nsParentID;
                    const affixGroup = document.createElement('li');
                    affixGroup.innerHTML = '<span class="link-secondary">' + nsParentName + '</span>'
                    affixUL.appendChild(affixGroup);
                    affixDiv.appendChild(affixUL);
                }
                if (affixUL) {
                    const affixLink = document.createElement('li');
                    affixLink.innerHTML = '<a class="link-body-emphasis" href="#' + nsID + '">' + nsShortName + '</a>';
                    affixUL.appendChild(affixLink);
                }

                let nsDD = nsDL.querySelector('#' + nsParentID);
                if (!nsDD) {
                    const nsDT = document.createElement('dt');
                    nsDT.innerHTML = '<h3>' + nsParentName + '</h3>';
                    nsDD = document.createElement('dd');
                    nsDD.id = nsParentID;
                    nsDL.appendChild(nsDT);
                    nsDL.appendChild(nsDD);
                }

                //console.info('api reference generator: update namespace list');
                const nsDiv = document.createElement('div');
                const nsAnchor = document.createElement('a');
                nsAnchor.innerText = nsShortName;
                nsAnchor.href = ns.href ?? '#' + nsID;
                nsDiv.appendChild(nsAnchor);
                nsDD.appendChild(nsDiv);

                //console.info('api reference generator: add namespace heading');
                const nsShort = document.createElement('h2');
                nsShort.innerText = nsShortName + ' ';
                nsShort.id = nsID;
                nsShort.classList.add('section', 'api');
                const nsBadge = document.createElement('span');
                nsBadge.innerText = 'Namespace';
                nsBadge.classList.add('badge', 'rounded-pill', 'bg-info');
                nsShort.appendChild(nsBadge);
                article.appendChild(nsShort);

                const nsDesc = document.createElement('pre');
                const nsCode = document.createElement('code');
                nsCode.classList.add('hljs', 'lang-csharp', 'language-csharp');
                nsCode.innerHTML = '<span class="hljs-keyword">namespace</span> ' + nsFullName;
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
    // end of api reference generator
}


if (document.readyState == 'loading') {
    window.addEventListener("DOMContentLoaded", ev => initializePage(ev));
} else {
    initializePage(undefined);
}
