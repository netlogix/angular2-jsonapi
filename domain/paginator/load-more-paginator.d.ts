import { Observable } from 'rxjs';
import { ResourceProxy, ConsumerBackend, Paginator } from "../../";
export declare class LoadMorePaginator {
    protected firstPage: string;
    protected consumerBackend: ConsumerBackend;
    protected paginator: Paginator;
    protected _data: ResourceProxy[];
    constructor(firstPage: string, consumerBackend: ConsumerBackend);
    more(): ResourceProxy[];
    loading: boolean;
    error: boolean;
    loading$: Observable<boolean>;
    hasMore: boolean;
    data: ResourceProxy[];
}
