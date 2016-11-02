import "reflect-metadata";
import { TypeBinder } from "./type-binder";
export declare function bind(type: any): PropertyDecorator;
export declare function generics(...generics: any[]): PropertyDecorator;
export declare function track(): PropertyDecorator;
export declare function identifier<T>(identifier: (object: T, binder?: TypeBinder) => any, scope?: any): ClassDecorator;
