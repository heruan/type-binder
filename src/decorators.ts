import "reflect-metadata";
import { TypeBinder } from "./type-binder";
import { designTypeKey, designGenericTypesKey, trackProperty, objectIdentifierKey, objectIdentifierScope } from "./metadata-keys";

export function bind(type: any): PropertyDecorator {
    return Reflect.metadata(designTypeKey, type);
}

export function generics(...generics: any[]): PropertyDecorator {
    return Reflect.metadata(designGenericTypesKey, generics);
}

export function track(): PropertyDecorator {
    return Reflect.metadata(trackProperty, true);
}

export function identifier<T>(identifier: (object: T, binder?: TypeBinder) => any, scope?: any): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata(objectIdentifierKey, identifier, target);
        Reflect.defineMetadata(objectIdentifierScope, scope, target);
    };
}
