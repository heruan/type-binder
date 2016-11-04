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
function track(trackingCallback) {
    if (trackingCallback === void 0) { trackingCallback = function (value) { return value; }; }
    return Reflect.metadata(metadataKeys.binderPropertyTrack, trackingCallback);
}
exports.track = track;
function trackEntries(trackingCallback) {
    return Reflect.metadata(metadataKeys.binderPropertyEntries, trackingCallback);
}
exports.trackEntries = trackEntries;
function identifier(identifier, scope) {
    return function (target) {
        Reflect.defineMetadata(metadataKeys.binderIdentifierKey, identifier, target);
        Reflect.defineMetadata(metadataKeys.binderIdentifierScope, scope, target);
    };
}
exports.identifier = identifier;
