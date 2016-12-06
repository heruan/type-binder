"use strict";
require("reflect-metadata");
var metadataKeys = require("./metadata-keys");
function bind(type) {
    return Reflect.metadata(metadataKeys.designType, type);
}
exports.bind = bind;
function generics() {
    var generics = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        generics[_i - 0] = arguments[_i];
    }
    return Reflect.metadata(metadataKeys.designGenericTypes, generics);
}
exports.generics = generics;
function track(comparingCallback, trackingCallback) {
    if (comparingCallback === void 0) { comparingCallback = function (v1, v2) { return v1 === v2; }; }
    if (trackingCallback === void 0) { trackingCallback = function (value) { return value; }; }
    return function (target, key) {
        Reflect.defineMetadata(metadataKeys.binderPropertyTrackCompare, comparingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyTrack, trackingCallback, target, key);
    };
}
exports.track = track;
function trackIterable(comparingCallback, trackingCallback) {
    if (comparingCallback === void 0) { comparingCallback = function (v1, v2) { return v1 === v2; }; }
    if (trackingCallback === void 0) { trackingCallback = function (iterable) { return Array.from(iterable); }; }
    return function (target, key) {
        Reflect.defineMetadata(metadataKeys.binderPropertyEntriesCompare, comparingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyEntries, trackingCallback, target, key);
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
