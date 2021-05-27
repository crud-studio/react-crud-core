import {FilterField, OrderDTO} from "./server";

export interface BaseEntity {
    name: string;
    api: {
        path: string;
        cacheName: string;
        defaultOrders: OrderDTO[];
        customFilterFields?: FilterField[];
    };
}
