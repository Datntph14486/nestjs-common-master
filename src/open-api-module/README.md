## 1. Các package cần cài đặt

- install

``` bash
npm install 
```

- file package.json:

```
...
"dependencies": {
    ...
    ...
},
...
```

- file .env

```
# Tham so cau hinh cho open-api ==========================================
open-api.url=http://10.100.30.100:8080/open-api
open-api.cache.token.ttl=60000
# Tham so cau hinh cho open-api ==========================================
```

- module cần khai báo trước

```
app-module, common-module, admin-module
```

## 2. Cách sử dụng
- Khai báo module trong app.module.ts