export interface Product {
    description: string;
    id: string;
    price: number;
    title: string;
}

export interface Stock {
    product_id: string;
    count: number;
}

export interface CreateProductRequestModel {
    description: string;
    count: number;
    price: number;
    title: string;
}