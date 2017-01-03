import "reflect-metadata";
import { TypeBinder } from "./type-binder";
export declare function bind(type: any, ...generics: any[]): PropertyDecorator;
export declare function generics(...generics: any[]): PropertyDecorator;
export declare function track<V>(trackingCallback?: (value: V) => V, comparingCallback?: (v1: V, v2: V) => boolean): PropertyDecorator;
export declare function trackIterable<V, I extends Iterable<V>>(trackingCallback?: (iterable: I) => any[], comparingCallback?: (v1: V, v2: V) => boolean): PropertyDecorator;
export declare function identifier<T>(identifier: (object: T, binder?: TypeBinder) => any, scope?: any): ClassDecorator;
