import { Observable } from "rxjs/Rx";
import { Type, Payload } from "../../";
export declare abstract class ResourceProxy {
    static _typeName: string;
    static _properties: any;
    private _type;
    private _payload;
    private _relatedDataLoadedSubject;
    private _relatedDataLoadedObservable;
    $type: Type;
    $identity: {
        id: string;
        type: string;
    };
    toString(): string;
    constructor();
    payload: Payload;
    offsetExists(propertyName: any): boolean;
    offsetGet(propertyName: any): any;
    offsetGetLoaded(propertyName: string): Promise<{}>;
    offsetGetAsync(propertyName: string): (Observable<ResourceProxy | ResourceProxy[]>);
    offsetSet(propertyName: any, value: any): void;
    loadRelationship(propertyName: string): Observable<ResourceProxy | ResourceProxy[]>;
    private offsetGetForAttribute(propertyName);
    private offsetGetForSingleRelationship(propertyName);
    private offsetGetForCollectionRelationship(propertyName);
    private getRelationshipPayloadData(propertyName);
    private offsetSetForAttribute(propertyName, value);
    private offsetSetForSingleRelationship(propertyName, value);
    private offsetSetForCollectionelationship(propertyName, value);
    private registerTypeName();
    private registerEventEmitters();
    private emitRelationshipLoaded(propertyName);
    private getRelationshipLoadedSubject(propertyName);
    private getRelationshipLoadedObservable(propertyName);
}
