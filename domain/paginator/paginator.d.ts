import { Observable, ReplaySubject } from 'rxjs';
import { ResourceProxy, ConsumerBackend, ResultPage } from "../../";
export declare class Paginator {
    protected firstPage: string;
    protected consumerBackend: ConsumerBackend;
    protected resultPage: ResultPage;
    protected subject: ReplaySubject<any>;
    constructor(firstPage: string, consumerBackend: ConsumerBackend);
    readonly resultPage$: Observable<ResultPage>;
    readonly data: ResourceProxy[];
    readonly hasNext: boolean;
    next(): void;
    protected hasLink(linkName: string): boolean;
}
