"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var metadataKeys = require("./metadata-keys");
var TypeBinder = (function () {
    function TypeBinder() {
        var _this = this;
        this.objectInstances = new Map();
        this.identityBinding = function (value, generics) { return value; };
        this.bindingCallbacks = new Map();
        this.bindingCallbacks.set(Map, function (value, generics, current) {
            if (generics === void 0) { generics = []; }
            if (current === void 0) { current = new Map(); }
            current.clear();
            value.forEach(function (pair) { return current.set(_this.bind(pair[0], generics[0]), _this.bind(pair[1], generics[1])); });
            return current;
        });
        this.bindingCallbacks.set(Set, function (value, generics, current) {
            if (generics === void 0) { generics = []; }
            if (current === void 0) { current = new Set(); }
            current.clear();
            value.forEach(function (element) { return current.add(_this.bind(element, generics[0])); });
            return current;
        });
        this.bindingCallbacks.set(Array, function (value, generics, current) {
            if (generics === void 0) { generics = []; }
            if (current === void 0) { current = []; }
            current.splice.apply(current, [0, current.length].concat(value.map(function (element) { return _this.bind(element, generics[0]); })));
            return current;
        });
        this.bindingCallbacks.set(Number, this.identityBinding);
        this.bindingCallbacks.set(String, this.identityBinding);
        this.bindingCallbacks.set(Boolean, this.identityBinding);
        this.bindingCallbacks.set(undefined, this.identityBinding);
    }
    TypeBinder.prototype.setBindingCallback = function (type, callback) {
        this.bindingCallbacks.set(type, callback);
    };
    TypeBinder.prototype.bind = function (value, type) {
        var generics = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            generics[_i - 2] = arguments[_i];
        }
        return this.update(value, type, generics);
    };
    TypeBinder.prototype.update = function (value, type, generics, current) {
        if (Array.isArray(type)) {
            generics = type.slice(1);
            type = type.shift();
        }
        if (this.bindingCallbacks.has(type)) {
            return this.bindingCallbacks.get(type)(value, generics, current);
        }
        else if (value !== null && typeof value === "object") {
            var object = this.createObject(type, value);
            var properties = this.createProperties(type, object, value);
            return Object.defineProperties(object, properties);
        }
        else {
            return value;
        }
    };
    TypeBinder.prototype.isBound = function (type, entity) {
        if (Reflect.hasMetadata(metadataKeys.binderIdentifierKey, type)) {
            var scope = Reflect.getMetadata(metadataKeys.binderIdentifierScope, type) || type;
            var key = Reflect.getMetadata(metadataKeys.binderIdentifierKey, type)(entity, this);
            if (this.objectInstances.has(scope) && this.objectInstances.get(scope).has(key)) {
                return true;
            }
        }
        return false;
    };
    TypeBinder.prototype.createObject = function (type, source) {
        var object;
        if (Reflect.hasMetadata(metadataKeys.binderIdentifierKey, type)) {
            var scope = Reflect.getMetadata(metadataKeys.binderIdentifierScope, type) || type;
            var key = Reflect.getMetadata(metadataKeys.binderIdentifierKey, type)(source, this);
            if (this.objectInstances.has(scope) && this.objectInstances.get(scope).has(key)) {
                object = this.objectInstances.get(scope).get(key);
            }
            else {
                object = Object.create(type.prototype);
                if (!this.objectInstances.has(scope)) {
                    this.objectInstances.set(scope, new Map());
                }
                this.objectInstances.get(scope).set(key, object);
            }
        }
        else {
            object = Object.create(type.prototype);
        }
        return object;
    };
    TypeBinder.prototype.createProperties = function (type, target, source) {
        var _this = this;
        var properties = {};
        Object.getOwnPropertyNames(source).forEach(function (property) {
            var propertyType = Reflect.getMetadata(metadataKeys.designType, type.prototype, property);
            if (typeof propertyType === "function") {
                propertyType = propertyType();
            }
            var propertyGenerics = Reflect.getMetadata(metadataKeys.designGenericTypes, type.prototype, property);
            if (propertyGenerics !== undefined) {
                propertyGenerics = propertyGenerics.map(function (genericType) { return (typeof genericType === "function") ? genericType() : genericType; });
            }
            var configurable = true;
            var enumerable = true;
            var writable = true;
            var value = propertyType
                ? _this.update(source[property], propertyType, propertyGenerics, target[property])
                : source[property];
            if (target[property] === undefined) {
                properties[property] = { configurable: configurable, enumerable: enumerable, writable: writable, value: value };
            }
            else {
                target[property] = value;
            }
            if (Reflect.hasMetadata(metadataKeys.binderPropertyTrack, type.prototype, property)) {
                var trackingCallback = Reflect.getMetadata(metadataKeys.binderPropertyTrack, type.prototype, property);
                var trackingValue = trackingCallback(value);
                Reflect.defineMetadata(metadataKeys.binderPropertyTrackValue, trackingValue, target, property);
            }
            if (Reflect.hasMetadata(metadataKeys.binderPropertyEntries, type.prototype, property)) {
                var trackingCallback = Reflect.getMetadata(metadataKeys.binderPropertyEntries, type.prototype, property);
                var trackingValue = trackingCallback(value);
                Reflect.defineMetadata(metadataKeys.binderPropertyEntriesValue, trackingValue, target, property);
            }
        });
        return properties;
    };
    TypeBinder.propertyHasChanged = function (object, property) {
        if (Reflect.hasMetadata(metadataKeys.binderPropertyTrackValue, object, property)) {
            var currentValue = object[property];
            var originalValue = Reflect.getMetadata(metadataKeys.binderPropertyTrackValue, object, property);
            return currentValue !== originalValue;
        }
        else {
            return false;
        }
    };
    return TypeBinder;
}());
exports.TypeBinder = TypeBinder;

//# sourceMappingURL=type-binder.js.map
