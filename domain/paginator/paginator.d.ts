import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ResourceProxy, ConsumerBackend, ResultPage } from "../../";
export declare class Paginator {
    protected firstPage: string;
    protected consumerBackend: ConsumerBackend;
    protected resultPage: ResultPage;
    protected subject: ReplaySubject<any>;
    protected _loading: number;
    protected loadingChange: Subject<boolean>;
    constructor(firstPage: string, consumerBackend: ConsumerBackend);
    readonly resultPage$: Observable<ResultPage>;
    readonly data: ResourceProxy[];
    readonly loading: boolean;
    readonly loading$: Observable<boolean>;
    readonly hasNext: boolean;
    next(): void;
    protected changeLoading(direction: number): void;
    protected hasLink(linkName: string): boolean;
}
