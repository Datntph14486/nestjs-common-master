## 1. Các package cần cài đặt

- install

``` bash
```

- file package.json:

```
```

- file .env

```
# Tham so cau hinh cho sso ===============================================
sso.client-id=
sso.jwt.algorithm=
sso.jwt.secret=
# (chưa làm) sso.local-role-mapping mặc định là false, trường hợp true, hệ thống lấy role từ db local thay vì role từ sso
sso.local-role-mapping=
# Tham so cau hinh cho sso ===============================================
```

- module cần khai báo trước

```
common-module
```

## 2. Cách sử dụng

- Khai báo module trong app.module.ts
