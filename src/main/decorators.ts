import "reflect-metadata";
import { TypeBinder } from "./type-binder";
import * as metadataKeys from "./metadata-keys";

export function bind(type: any, ...generics: any[]): PropertyDecorator {
    return (target: Function, key: string) => {
        Reflect.defineMetadata(metadataKeys.designType, type, target, key);
        if (generics.length > 0) {
            Reflect.defineMetadata(metadataKeys.designGenericTypes, generics, target, key);
        }
    };
}

export function generics(...generics: any[]): PropertyDecorator {
    return Reflect.metadata(metadataKeys.designGenericTypes, generics);
}

export function track<V>(
        comparingCallback: (v1: V, v2: V) => boolean = (v1, v2) => v1 === v2,
        trackingCallback: (value: V) => V = value => value): PropertyDecorator {
    return (target: Function, key: string) => {
        Reflect.defineMetadata(metadataKeys.binderPropertyTrackCompare, comparingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyTrack, trackingCallback, target, key);
    };
}

export function trackIterable<V, I extends Iterable<V>>(
        comparingCallback: (v1: V, v2: V) => boolean = (v1, v2) => v1 === v2,
        trackingCallback: (iterable: I) => V[] = iterable => Array.from(iterable)): PropertyDecorator {
    return (target: Function, key: string) => {
        Reflect.defineMetadata(metadataKeys.binderPropertyEntriesCompare, comparingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyEntries, trackingCallback, target, key);
    };
}

export function identifier<T>(identifier: (object: T, binder?: TypeBinder) => any, scope?: any): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata(metadataKeys.binderIdentifierKey, identifier, target);
        Reflect.defineMetadata(metadataKeys.binderIdentifierScope, scope, target);
    };
}
