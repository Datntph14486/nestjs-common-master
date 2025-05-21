import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ACacheAdapter } from "./a-cache.adapter";

@Injectable()
export class MemCacheAdapter extends ACacheAdapter {

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        super(cacheManager)
    }
}