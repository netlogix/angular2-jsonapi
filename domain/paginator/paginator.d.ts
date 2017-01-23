import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ResourceProxy, ConsumerBackend, ResultPage } from "../../";
export declare class Paginator {
    protected firstPage: string;
    protected consumerBackend: ConsumerBackend;
    protected resultPage: ResultPage;
    protected subject: ReplaySubject<any>;
    protected _loading: number;
    protected _error: boolean;
    protected loadingChange: Subject<boolean>;
    constructor(firstPage: string, consumerBackend: ConsumerBackend);
    resultPage$: Observable<ResultPage>;
    data: ResourceProxy[];
    loading: boolean;
    error: boolean;
    loading$: Observable<boolean>;
    hasNext: boolean;
    next(): void;
    protected changeLoading(direction: number): void;
    protected hasLink(linkName: string): boolean;
}
