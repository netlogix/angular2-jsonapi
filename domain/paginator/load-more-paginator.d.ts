import { ResourceProxy, ConsumerBackend } from "@netlogix/jsonapi";
import { Paginator } from './paginator';
export declare class LoadMorePaginator {
    protected firstPage: string;
    protected consumerBackend: ConsumerBackend;
    protected paginator: Paginator;
    protected _data: ResourceProxy[];
    constructor(firstPage: string, consumerBackend: ConsumerBackend);
    more(): any[];
    hasMore: boolean;
    data: ResourceProxy[];
}
