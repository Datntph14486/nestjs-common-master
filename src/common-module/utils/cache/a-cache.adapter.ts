import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { ICacheAdapter } from "./i-cache-adapter";
import { Cache } from "cache-manager";
import { CacheUtils } from "./cache.utils";
import { NodeModulesUtils } from "../node-modules.utils";

export abstract class ACacheAdapter implements ICacheAdapter {
    version: string

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        this.version = NodeModulesUtils.versions['cache-manager'] || ''
        this.version = this.version.startsWith('4') ? '4' : this.version
        CacheUtils.registryCacheAdapter(cacheManager.store['name'], this)
    }
    
    incr(key: string, ttl?: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

    get<T>(key: string): Promise<T> {
        return this.cacheManager.get<T>(key)
    }

    set(key: string, value: any, ttl?: number): Promise<void> {
        ttl = ttl || 60000;
        ttl = ttl / (this.version === '4' ? 1000 : 1)
        let __ttl: any = this.version === '4' ? { ttl: ttl } : ttl
        return this.cacheManager.set(key, value, __ttl)
    }

    del(key: string): Promise<void> {
        return this.cacheManager.del(key);
    }

    reset(): Promise<void> {
        return this.cacheManager.reset();
    }

    wrap<T>(key: string, closure: () => Promise<T>, ttl?: number): Promise<T> {
        ttl = ttl || 60000;
        ttl = ttl / (this.version === '4' ? 1000 : 1)
        let __ttl: any = this.version === '4' ? { ttl: ttl } : ttl
        return this.cacheManager.wrap(key, closure, __ttl)
    }
}