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
        trackingCallback: (value: V) => V = value => value,
        comparingCallback: (v1: V, v2: V) => boolean = (v1, v2) => v1 === v2
    ): PropertyDecorator {
    return (target: Function, key: string) => {
        Reflect.defineMetadata(metadataKeys.binderPropertyTrack, trackingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyTrackCompare, comparingCallback, target, key);
    };
}

export function trackIterable<V, I extends Iterable<V>>(
        trackingCallback: (iterable: I) => any[] = iterable => Array.from(iterable),
        comparingCallback: (v1: V, v2: V) => boolean = (v1, v2) => v1 === v2
    ): PropertyDecorator {
    return (target: Function, key: string) => {
        Reflect.defineMetadata(metadataKeys.binderPropertyEntries, trackingCallback, target, key);
        Reflect.defineMetadata(metadataKeys.binderPropertyEntriesCompare, comparingCallback, target, key);
    };
}

export function identifier<T>(identifier: (object: T, binder?: TypeBinder) => any, scope?: any): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata(metadataKeys.binderIdentifierKey, identifier, target);
        Reflect.defineMetadata(metadataKeys.binderIdentifierScope, scope, target);
    };
}
