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
ldap.enable=<true/false>
```

- module cần khai báo trước

```
common-module, admin-module
```

## 2. Cách sử dụng
- Khai báo module trong app.module.ts