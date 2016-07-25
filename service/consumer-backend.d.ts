import { Http, RequestOptions } from '@angular/http';
import { Observable, AsyncSubject } from "rxjs/Rx";
import { ResourceProxy, Type, Uri, Payload } from "../";
export declare class ConsumerBackend {
    protected http: Http;
    protected requestOptions: RequestOptions;
    contentType: string;
    protected types: {};
    protected typeObservables: {
        [typeName: string]: AsyncSubject<Type>;
    };
    protected headers: {
        [uriPattern: string]: {
            [header: string]: string;
        };
    };
    protected unitOfWork: {
        [cacheIdentifier: string]: ResourceProxy;
    };
    constructor(http: Http, requestOptions: RequestOptions);
    addType(type: Type): void;
    registerEndpointsByEndpointDiscovery(endpointDiscovery: Uri): Promise<any>;
    registerEndpoint(typeName: string, href: string): void;
    closeEndpointDiscovery(): void;
    fetchFromUri(queryUri: Uri): Observable<ResourceProxy[]>;
    findByTypeAndFilter(typeName: string, filter?: {
        [key: string]: any;
    }, include?: string[]): Observable<ResourceProxy[]>;
    getFromUnitOfWork(type: string, id: string): ResourceProxy;
    add(resource: ResourceProxy): Promise<any>;
    create(type: string, id: string, defaultValue?: {
        [key: string]: any;
    }, initializeEmptyRelationships?: boolean): ResourceProxy;
    protected getType(typeName: string): AsyncSubject<Type>;
    protected requestJson(uri: Uri): Observable<any>;
    protected addJsonResultToCache(result: any, initializeEmptyRelationships?: boolean): void;
    protected assignResourceDefinitionToPayload(payload: Payload, resourceDefinition: Payload, type: Type): (any[]);
    protected calculateCacheIdentifier(type: string, id: string): string;
    protected getRequestOptions(method: string, requestUri?: string): RequestOptions;
}
