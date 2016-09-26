import { ResourceProxy } from "../../";
export declare class ResultPage {
    data: ResourceProxy[];
    links: {
        [linkName: string]: string;
    };
    constructor(data?: ResourceProxy[], links?: {
        [linkName: string]: string;
    });
}
