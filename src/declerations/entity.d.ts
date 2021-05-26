export interface BaseEntity {
    name: string;
    api: {
        path: string;
        cacheName: string;
    };
}
