import { Http, RequestOptions } from '@angular/http';
import { Observable, ReplaySubject } from "rxjs/Rx";
import { ResourceProxy, Type, Uri, Payload, ResultPage } from "../";
export declare class ConsumerBackend {
    protected http: Http;
    protected requestOptions: RequestOptions;
    contentType: string;
    headers: {
        [uriPattern: string]: {
            [header: string]: string;
        };
    };
    protected types: {};
    protected typeObservables: {
        [typeName: string]: ReplaySubject<Type>;
    };
    protected unitOfWork: {
        [cacheIdentifier: string]: ResourceProxy;
    };
    constructor(http: Http, requestOptions: RequestOptions);
    addType(type: Type): void;
    registerEndpointsByEndpointDiscovery(endpointDiscovery: Uri): Promise<any>;
    registerEndpoint(typeName: string, href: string): void;
    closeEndpointDiscovery(): void;
    fetchFromUri(queryUri: Uri): Observable<ResultPage>;
    fetchContentFromUri(queryUri: Uri): Observable<ResourceProxy[]>;
    findResultPageByTypeAndFilter(typeName: string, filter?: {
        [key: string]: any;
    }, include?: string[]): Observable<ResultPage>;
    findByTypeAndFilter(typeName: string, filter?: {
        [key: string]: any;
    }, include?: string[]): Observable<ResourceProxy[]>;
    getFromUnitOfWork(type: string, id: string): ResourceProxy;
    add(resource: ResourceProxy): Promise<any>;
    addToUri(resource: ResourceProxy, targetUri: string): Promise<{}>;
    create(type: string, id: string, defaultValue?: {
        [key: string]: any;
    }, initializeEmptyRelationships?: boolean): ResourceProxy;
    getResourceType(typeName: string): Observable<Type>;
    protected getType(typeName: string): ReplaySubject<Type>;
    protected requestJson(uri: Uri): Observable<any>;
    protected addJsonResultToCache(result: any, initializeEmptyRelationships?: boolean): void;
    protected assignResourceDefinitionToPayload(payload: Payload, resourceDefinition: Payload, type: Type): (any[]);
    protected calculateCacheIdentifier(type: string, id: string): string;
    protected getRequestOptions(method: string, requestUri?: string): RequestOptions;
}
