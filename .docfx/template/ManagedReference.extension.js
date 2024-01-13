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
let dumpJsonOnce;
exports.postTransform = function (model) {

    fixSourceCodeAnchor(model);

    if (model.children) {
        for (const child of model.children) {
            fixSourceCodeAnchor(child);

            if (child.children) {
                for (const grand of child.children) {
                    fixSourceCodeAnchor(grand);

                    if (!dumpJsonOnce && grand.sourceurl) {
                        dumpJsonOnce = true;
                        console.log(JSON.stringify(model, null, 2));
                    }
                }
            }
        }
    }

    return model;
}


function fixSourceCodeAnchor(modelData) {
    // fix source code link. see define_symbols.txt for detail
    if (!modelData || !modelData.sourceurl)
        return;

    let link = new String(modelData.sourceurl);
    if (link.search(/#L[0-9]+$/) < 0)
        return;

    var p = link.search(/[0-9]+$/);
    modelData.sourceurl
        = link.substring(0, p)
        + (parseInt(link.substring(p)) - 112);  // <-- subtract define_symbols.txt line count
}