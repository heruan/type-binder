"use strict";
require("reflect-metadata");
var metadataKeys = require("./metadata-keys");
function bind(type) {
    var generics = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        generics[_i - 1] = arguments[_i];
    }
    return function (target, key) {
        Reflect.defineMetadata(metadataKeys.designType, type, target, key);
        if (generics.length > 0) {
            Reflect.defineMetadata(metadataKeys.designGenericTypes, generics, target, key);
        }
    };
}
exports.bind = bind;
function generics() {
    var generics = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        generics[_i] = arguments[_i];
    }
    return Reflect.metadata(metadataKeys.designGenericTypes, generics);
}
exports.generics = generics;
function track(trackingCallback, comparingCallback) {
    if (trackingCallback === void 0) { trackingCallback = function (value) { return value; }; }
    if (comparingCallback === void 0) { comparingCallback = function (v1, v2) { return v1 === v2; }; }
    return function (target, key) {
        Reflect.defineMetadata(metadataKeys.binderPropertyTrack, trackingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyTrackCompare, comparingCallback, target, key);
    };
}
exports.track = track;
function trackIterable(trackingCallback, comparingCallback) {
    if (trackingCallback === void 0) { trackingCallback = function (iterable) { return Array.from(iterable); }; }
    if (comparingCallback === void 0) { comparingCallback = function (v1, v2) { return v1 === v2; }; }
    return function (target, key) {
        Reflect.defineMetadata(metadataKeys.binderPropertyEntries, trackingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyEntriesCompare, comparingCallback, target, key);
    };
}
exports.trackIterable = trackIterable;
function identifier(identifier, scope) {
    return function (target) {
        Reflect.defineMetadata(metadataKeys.binderIdentifierKey, identifier, target);
        Reflect.defineMetadata(metadataKeys.binderIdentifierScope, scope, target);
    };
}
exports.identifier = identifier;

//# sourceMappingURL=decorators.js.map
