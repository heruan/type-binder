import "reflect-metadata";
import * as metadataKeys from "./metadata-keys";

export class TypeBinder {

    private objectInstances: Map<any, Map<any, Object>> = new Map<any, Map<any, Object>>();

    private identityBinding = (value, generics) => value;

    private bindingCallbacks: Map<any, (value: any, generics: any[], current?: any) => any>;

    public constructor() {
        this.bindingCallbacks = new Map<any, (value: any, generics: any[]) => any>();
        this.bindingCallbacks.set(Map, (value: [any, any][], generics: any[] = [], current: Map<any, any> = new Map()) => {
            current.clear();
            value.forEach(pair => current.set(this.bind(pair[0], generics[0]), this.bind(pair[1], generics[1])));
            return current;
        });
        this.bindingCallbacks.set(Set, (value: any[], generics: any[] = [], current: Set<any> = new Set()) => {
            current.clear();
            value.forEach(element => current.add(this.bind(element, generics[0])));
            return current;
        });
        this.bindingCallbacks.set(Array, (value: any[], generics: any[] = [], current: any[] = []) => {
            current.splice(0, current.length, ...value.map(element => this.bind(element, generics[0])));
            return current;
        });
        this.bindingCallbacks.set(Number, this.identityBinding);
        this.bindingCallbacks.set(String, this.identityBinding);
        this.bindingCallbacks.set(Boolean, this.identityBinding);
        this.bindingCallbacks.set(undefined, this.identityBinding);
    }

    public setBindingCallback(type: any, callback: (value: any, generics: any[]) => any): void {
        this.bindingCallbacks.set(type, callback);
    }

    public bind<T>(value: any, type: new(...args) => T, ...generics: any[]): T {
        return this.update(value, type, generics);
    }

    public update<T>(value: any, type: new(...args) => T, generics: any[], current?: T): T {
        if (Array.isArray(type)) {
            generics = type.slice(1);
            type = type.shift();
        }
        if (this.bindingCallbacks.has(type)) {
            return this.bindingCallbacks.get(type)(value, generics, current);
        } else if (value !== null && typeof value === "object") {
            let object = this.createObject(type, value);
            let properties = this.createProperties(type, object, value);
            return Object.defineProperties(object, properties);
        } else {
            return value;
        }
    }

    public isBound<T>(type: new(...args) => T, entity: T): boolean {
        if (Reflect.hasMetadata(metadataKeys.binderIdentifierKey, type)) {
            let scope = Reflect.getMetadata(metadataKeys.binderIdentifierScope, type) || type;
            let key = Reflect.getMetadata(metadataKeys.binderIdentifierKey, type)(entity, this);
            if (this.objectInstances.has(scope) && this.objectInstances.get(scope).has(key)) {
                return true;
            }
        }
        return false;
    }

    private createObject<T>(type: new(...args) => T, source: any): T {
        let object: T;
        if (Reflect.hasMetadata(metadataKeys.binderIdentifierKey, type)) {
            let scope = Reflect.getMetadata(metadataKeys.binderIdentifierScope, type) || type;
            let key = Reflect.getMetadata(metadataKeys.binderIdentifierKey, type)(source, this);
            if (this.objectInstances.has(scope) && this.objectInstances.get(scope).has(key)) {
                object = <T> this.objectInstances.get(scope).get(key);
            } else {
                object = Object.create(type.prototype);
                if (!this.objectInstances.has(scope)) {
                    this.objectInstances.set(scope, new Map<any, Object>());
                }
                this.objectInstances.get(scope).set(key, object);
            }
        } else {
            object = Object.create(type.prototype);
        }
        return object;
    }

    private createProperties<T>(type: new(...args) => T, target: T, source: Object): PropertyDescriptorMap {
        let properties: PropertyDescriptorMap = {};
        Object.getOwnPropertyNames(source).forEach(property => {
            let propertyType = Reflect.getMetadata(metadataKeys.designType, type.prototype, property);
            if (typeof propertyType === "function") {
                propertyType = propertyType();
            }
            let propertyGenerics: any[] = Reflect.getMetadata(metadataKeys.designGenericTypes, type.prototype, property);
            if (propertyGenerics !== undefined) {
                propertyGenerics = propertyGenerics.map(genericType => (typeof genericType === "function") ? genericType() : genericType);
            }
            let configurable = true;
            let enumerable = true;
            let writable = true;
            let value = propertyType
                ? this.update(source[property], propertyType, propertyGenerics, target[property])
                : source[property];
            if (target[property] === undefined) {
                properties[property] = { configurable, enumerable, writable, value };
            } else {
                target[property] = value;
            }
            if (Reflect.hasMetadata(metadataKeys.binderPropertyTrack, type.prototype, property)) {
                let trackingCallback: <V>(value: V) => V = Reflect.getMetadata(metadataKeys.binderPropertyTrack, type.prototype, property);
                let trackingValue = trackingCallback(value);
                Reflect.defineMetadata(metadataKeys.binderPropertyTrackValue, trackingValue, target, property);
            }
            if (Reflect.hasMetadata(metadataKeys.binderPropertyEntries, type.prototype, property)) {
                let trackingCallback: <I extends Iterable<V>, V>(iterable: I) => V[] = Reflect.getMetadata(metadataKeys.binderPropertyEntries, type.prototype, property);
                let trackingValue = trackingCallback(value);
                Reflect.defineMetadata(metadataKeys.binderPropertyEntriesValue, trackingValue, target, property);
            }
        });
        return properties;
    }

    public static propertyHasChanged(object: Object, property: string): boolean {
        if (Reflect.hasMetadata(metadataKeys.binderPropertyTrackValue, object, property)) {
            let currentValue = object[property];
            let originalValue = Reflect.getMetadata(metadataKeys.binderPropertyTrackValue, object, property);
            return currentValue !== originalValue;
        } else {
            return false;
        }
    }

}
