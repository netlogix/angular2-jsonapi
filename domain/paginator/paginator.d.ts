import { ResourceProxy, ConsumerBackend, ResultPage } from "@netlogix/jsonapi";
import { Observable, ReplaySubject } from 'rxjs';
export declare class Paginator {
    protected firstPage: string;
    protected consumerBackend: ConsumerBackend;
    protected resultPage: ResultPage;
    protected subject: ReplaySubject<any>;
    constructor(firstPage: string, consumerBackend: ConsumerBackend);
    resultPage$: Observable<ResultPage>;
    data: ResourceProxy[];
    hasNext: boolean;
    next(): void;
    protected hasLink(linkName: string): boolean;
}
