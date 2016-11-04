import "reflect-metadata";
import { TypeBinder } from "./type-binder";
import * as metadataKeys from "./metadata-keys";

export function bind(type: any): PropertyDecorator {
    return Reflect.metadata(metadataKeys.designType, type);
}

export function generics(...generics: any[]): PropertyDecorator {
    return Reflect.metadata(metadataKeys.designGenericTypes, generics);
}

export function track<T>(trackingCallback: (value: T) => T = (value: T) => value): PropertyDecorator {
    return Reflect.metadata(metadataKeys.binderPropertyTrack, trackingCallback);
}

export function trackEntries<T, E>(trackingCallback: (value: T) => E[]): PropertyDecorator {
    return Reflect.metadata(metadataKeys.binderPropertyEntries, trackingCallback);
}

export function identifier<T>(identifier: (object: T, binder?: TypeBinder) => any, scope?: any): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata(metadataKeys.binderIdentifierKey, identifier, target);
        Reflect.defineMetadata(metadataKeys.binderIdentifierScope, scope, target);
    };
}
