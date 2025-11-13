// lib/storage.ts
"use client";

import { Order, Review } from "@/models/types";

const ORDERS_KEY = "fb_orders";
const PENDING_KEY = "fb_pending_order";
const REVIEWS_KEY = "fb_reviews";

export const Storage = {
    getOrders(): Order[] {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    },
    saveOrders(list: Order[]) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    },
    pushOrder(order: Order) {
        const list = Storage.getOrders();
        list.unshift(order);
        Storage.saveOrders(list);
    },

    setPending(data: any) {
        localStorage.setItem(PENDING_KEY, JSON.stringify(data));
    },
    getPending<T = any>(): T | null {
        const raw = localStorage.getItem(PENDING_KEY);
        return raw ? (JSON.parse(raw) as T) : null;
    },
    clearPending() {
        localStorage.removeItem(PENDING_KEY);
    },

    getReviews(): Review[] {
        return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]");
    },
    pushReview(r: Review) {
        const list = Storage.getReviews();
        list.unshift(r);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
    },
};
