// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

/**
 * This method will be called at the start of exports.transform in ManagedReference.html.primary.js
 */
exports.preTransform = function (model) {
    return model;
}

/**
 * This method will be called at the end of exports.transform in ManagedReference.html.primary.js
 */
var dumpJsonOnce;
exports.postTransform = function (model) {

    updateTypeModelData(model);

    if (!dumpJsonOnce && model.children[0]?.children[0]?.isDeprecated) {
        dumpJsonOnce = true;
        console.log(JSON.stringify(model));
    }

    return model;
}


function updateTypeModelData(model) {
    if (!model)
        return;

    // fix source code link. see define_symbols.txt for detail
    if (model.sourceurl) {
        let link = new String(model.sourceurl);
        if (link.search(/#L[0-9]+$/) >= 0) {
            var p = link.search(/[0-9]+$/);
            model.sourceurl
                = link.substring(0, p)
                + (parseInt(link.substring(p)) - 112);  // <-- subtract define_symbols.txt line count
        }
    }

    // obsolete attribute
    if (model.attributes) {
        for (const attr of model.attributes) {
            if (attr.type == 'System.ObsoleteAttribute') {
                model.isDeprecated = true;
            }
        }
    }

    // enum
    if (model.isEnum && model.isDeprecated && model.syntax?.content) {
        for (const content of model.syntax.content) {
            content.value = content.value.replaceAll(/\][\s\r\n\\rn]*/, '<br />');
        }
    }

    // recursive
    if (model.children) {
        for (const child of model.children) {
            updateTypeModelData(child);
        }
    }
}
