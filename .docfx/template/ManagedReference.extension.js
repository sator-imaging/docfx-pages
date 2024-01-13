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
var dumpDeprecatedOnce;
var dumpEnumOnce;
exports.postTransform = function (model) {

    updateTypeModelData(model);

    if (!dumpDeprecatedOnce && model.children[0]?.children[0]?.isDeprecated) {
        dumpDeprecatedOnce = true;
        console.log(JSON.stringify(model));
    }

    if (!dumpEnumOnce && model.isEnum && model.children[0]?.children[0]) {
        dumpEnumOnce = true;
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
    if (model.isEnum && model.children) {
        for (const child of model.children) {
            if (!child.children)
                continue;
            for (const grand of child.children) {
                if (!grand.syntax?.content)
                    continue;
                for (const content of grand.syntax.content) {
                    // NOTE: model data has only obsolete attribute in syntax data even if other atttributes exist.
                    //       and newline will be added after ']' automatically, so nothing to do here.
                }
            }
        }
    }

    // recursive
    if (model.children) {
        for (const child of model.children) {
            updateTypeModelData(child);
        }
    }
}
