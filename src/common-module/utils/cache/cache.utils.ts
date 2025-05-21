import { Logger } from "@nestjs/common";
import { ICacheAdapter } from "./i-cache-adapter";

export class CacheUtils {
    static readonly log = new Logger(CacheUtils.name)
    static cacheAdapter: CacheDefinition[] = []

    /**
     * Trả về CacheAdapter, trường hợp không truyền store, trả về Adater được khai báo sau cùng
     * @param store 
     * @returns 
     */
    static getCacheAdapter(store?: string): ICacheAdapter {
        let config: CacheDefinition = this.cacheAdapter.find((item: CacheDefinition) => {
            return item.store === store
        })
        let adapter: ICacheAdapter = config?.adapter || this.cacheAdapter.at(-1)?.adapter
        return adapter
    }

    static registryCacheAdapter(store: string, adapter: ICacheAdapter) {
        let config: CacheDefinition = this.cacheAdapter.find((item: CacheDefinition) => {
            return item.store === store
        })
        if (config) {
            config.adapter = adapter
        } else {
            this.cacheAdapter.push({ store: store, adapter: adapter })
        }
    }
}

type CacheDefinition = { store: string, adapter: ICacheAdapter }