import "reflect-metadata";
export declare class TypeBinder {
    private objectInstances;
    private identityBinding;
    private bindingCallbacks;
    constructor();
    setBindingCallback(type: any, callback: (value: any, generics: any[]) => any): void;
    bind<T>(value: any, type: new (...args) => T, ...generics: any[]): T;
    isBound<T>(type: new (...args) => T, entity: T): boolean;
    private createObject<T>(type, source);
    private createProperties<T>(type, target, source);
    static propertyHasChanged(object: Object, property: string): boolean;
}
