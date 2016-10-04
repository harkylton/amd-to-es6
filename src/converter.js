"use strict";

const escodegen = require("escodegen");
const beautify = require("js-beautify").js_beautify;
const hasDefine = require("./lib/hasDefine");
const getDependencies = require("./lib/getDependencies");
const getModuleCode = require("./lib/getModuleCode");
const generateImports = require("./lib/generateImports");
const generateCode = require("./lib/generateCode");

module.exports = function (source, options) {
    options = options || {};
    // this could be optimized, the source is parsed in 3 places
    // an ast tree could be passed instead to the methods
    if (!hasDefine(source)) {
        return source;
    }
    var dependencies = getDependencies(source);
    var nodes = getModuleCode(source);
    var imports = generateImports(dependencies, options);
    var code = generateCode(source, nodes, options);
    var program = { type: "Program", body: imports.concat(code) };
    var result = escodegen.generate(program, {
        format: {
            quotes: options.quotes
        }
    });
    if (options.beautify) {
        return beautify(result, {
            end_with_newline: true
        });
    }
    return result;
};
