## 1. Các package cần cài đặt

- install

``` bash
npm install axios crypto crypto-js
```

- file package.json:

```
...
"dependencies": {
    ...
    "axios": "^1.2.1",
    ...
},
...
```

- file .env

```
# Tham so cau hinh cho common module =====================================
jwt.expire-time=3600
jwt.issuer=xxx
jwt.algorithm=HS256
jwt.secret=2XH@7d8hah@hrg3Vkep6ukEjL2bkHaKL

crypto.sign.sha1_with_rsa.public-key=
crypto.sign.sha1_with_rsa.private-key=
crypto.sign.sha1_with_rsa.passphare=
# Tham so cau hinh cho common module =====================================
```

- module cần khai báo trước

```
```

## 2. Cách sử dụng

- Khai báo module trong app.module.ts
