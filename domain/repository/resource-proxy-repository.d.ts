import { Observable } from "rxjs/Rx";
import { ConsumerBackend, ResourceProxy } from "../../";
export declare abstract class ResourceProxyRepository {
    protected _consumerBackend: ConsumerBackend;
    protected resource: typeof ResourceProxy;
    constructor(_consumerBackend: ConsumerBackend);
    findAll(filter?: {
        [key: string]: any;
    }, include?: string[]): Observable<ResourceProxy[]>;
    findOne(filter?: {
        [key: string]: any;
    }, include?: string[]): Observable<ResourceProxy>;
    findByIdentifier(identifier: string, include?: string[]): Observable<ResourceProxy>;
}
