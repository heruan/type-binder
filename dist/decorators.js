"use strict";
require("reflect-metadata");
var metadata_keys_1 = require("./metadata-keys");
function bind(type) {
    return Reflect.metadata(metadata_keys_1.designTypeKey, type);
}
exports.bind = bind;
function generics() {
    var generics = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        generics[_i - 0] = arguments[_i];
    }
    return Reflect.metadata(metadata_keys_1.designGenericTypesKey, generics);
}
exports.generics = generics;
function track() {
    return Reflect.metadata(metadata_keys_1.trackProperty, true);
}
exports.track = track;
function identifier(identifier, scope) {
    return function (target) {
        Reflect.defineMetadata(metadata_keys_1.objectIdentifierKey, identifier, target);
        Reflect.defineMetadata(metadata_keys_1.objectIdentifierScope, scope, target);
    };
}
exports.identifier = identifier;
