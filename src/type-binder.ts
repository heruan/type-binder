import "reflect-metadata";
import { designTypeKey, designGenericTypesKey, trackProperty, trackPropertyOriginal, objectIdentifierKey, objectIdentifierScope } from "./metadata-keys";

export class TypeBinder {

    private objectInstances: Map<any, Map<any, Object>> = new Map<any, Map<any, Object>>();

    private identityBinding = (value, generics) => value;

    private bindingCallbacks: Map<any, (value: any, generics: any[]) => any>;

    public constructor() {
        this.bindingCallbacks = new Map<any, (value: any, generics: any[]) => any>();
        this.bindingCallbacks.set(Map, (value: [any, any][], generics: any[]) => new Map(
            value.map(pair => <[{}, {}]> [
                this.bind(pair[0], generics[0]),
                this.bind(pair[1], generics[1])
            ])
        ));
        this.bindingCallbacks.set(Set, (value: any[], generics: any[]) => new Set(
            value.map(element => this.bind(element, generics[0]))
        ));
        this.bindingCallbacks.set(Array, (value: any[], generics: any[]) => value.map(
            element => this.bind(element, generics[0])
        ));
        this.bindingCallbacks.set(Number, this.identityBinding);
        this.bindingCallbacks.set(String, this.identityBinding);
        this.bindingCallbacks.set(Boolean, this.identityBinding);
        this.bindingCallbacks.set(undefined, this.identityBinding);
    }

    public setBindingCallback(type: any, callback: (value: any, generics: any[]) => any): void {
        this.bindingCallbacks.set(type, callback);
    }

    public propertyHasChanged(object: Object, property: string): boolean {
        if (Reflect.hasMetadata(trackPropertyOriginal, object, property)) {
            let currentValue = object[property];
            let originalValue = Reflect.getMetadata(trackPropertyOriginal, object, property);
            return currentValue !== originalValue;
        } else {
            return false;
        }
    }

    public bind<T>(value: any, type: new(...args) => T, ...generics: any[]): T {
        if (Array.isArray(type)) {
            generics = type.slice(1);
            type = type[0];
        }
        if (this.bindingCallbacks.has(type)) {
            return this.bindingCallbacks.get(type)(value, generics);
        } else if (typeof value === "object") {
            let object = this.createObject(type, value);
            let properties = this.createProperties(type, object, value);
            return Object.defineProperties(object, properties);
        } else {
            return value;
        }
    }

    private createObject<T>(type: new(...args) => T, source: Object): T {
        let object: T;
        if (Reflect.hasMetadata(objectIdentifierKey, type)) {
            let key = Reflect.getMetadata(objectIdentifierKey, type)(source, this);
            let scope = Reflect.getMetadata(objectIdentifierScope, type) || type;
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
            let propertyType = Reflect.getMetadata(designTypeKey, type.prototype, property);
            let propertyGenerics = Reflect.getMetadata(designGenericTypesKey, type.prototype, property);
            properties[property] = {
                configurable: false,
                enumerable: true,
                writable: true,
                value: this.bind(source[property], propertyType, ...propertyGenerics)
            };
            if (Reflect.getMetadata(trackProperty, type.prototype, property)) {
                Reflect.defineMetadata(trackPropertyOriginal, properties[property].value, target, property);
            }
        });
        return properties;
    }

}
