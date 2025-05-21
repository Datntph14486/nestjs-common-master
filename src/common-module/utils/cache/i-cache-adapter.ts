export interface ICacheAdapter {
    /**
     * retrieve items from the cache
     * @param key 
     */
    get<T>(key: string): Promise<T>;

    /**
     * add an item to the cache
     * @param key 
     * @param value 
     * @param ttl expiration time in milliseconds
     */
    set(key: string, value: any, ttl?: number): Promise<void>;

    /**
     * remove an item from the cache
     * @param key 
     */
    del(key: string): Promise<void>;

    /**
     * Increments the number stored at key by one
     * @param key 
     * @param ttl 
     */
    incr(key: string, ttl?: number): Promise<number>

    /**
     * clear the entire cache
     */
    reset(): Promise<void>;

    wrap<T>(key: string, closure: () => Promise<T>, ttl?: number): Promise<T>;
}