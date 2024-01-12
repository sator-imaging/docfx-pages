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
exports.postTransform = function (model) {

    // fix source code link. see define_symbols.txt for detail
    if (model.sourceurl) {
        let link = new String(model.sourceurl);

        var p = link.search(/[0-9]+$/);
        if (p < 0) continue;

        model.sourceurl
            = link.substring(0, p)
            + (parseInt(link.substring(p)) - 112);  // <-- subtract define_symbols.txt line count
    }

    return model;
}
