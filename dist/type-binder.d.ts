import "reflect-metadata";
export declare class TypeBinder {
    private objectInstances;
    private identityBinding;
    private bindingCallbacks;
    constructor();
    setBindingCallback(type: any, callback: (value: any, generics: any[]) => any): void;
    propertyHasChanged(object: Object, property: string): boolean;
    bind<T>(value: any, type: new (...args) => T, ...generics: any[]): T;
    private createObject<T>(type, source);
    private createProperties<T>(type, target, source);
}
