# ZOBO VN

Website landing page ZOBO VN chạy trên Netlify, có trang quản trị `/admin` bằng Decap CMS.

Bạn có thể thêm, sửa, xóa sản phẩm từ giao diện admin mà không cần sửa code thủ công.

## Cách hoạt động

- Trang chủ đọc sản phẩm từ `data/products.json`.
- Trang `/admin` dùng Decap CMS để sửa file dữ liệu và upload ảnh.
- Khi bấm publish trong admin, Decap CMS commit thay đổi lên GitHub.
- Netlify tự deploy lại website sau mỗi lần thay đổi.

## Link hiện tại

- Website: `https://thunderous-seahorse-11fa34.netlify.app/`
- Admin: `https://thunderous-seahorse-11fa34.netlify.app/admin`

## Cấu trúc quan trọng

```text
.
├─ index.html
├─ admin/
│  ├─ index.html
│  └─ config.yml
├─ data/
│  └─ products.json
├─ assets/
│  ├─ logo.png
│  ├─ products/
│  └─ uploads/
├─ js/
│  ├─ data.js
│  └─ main.js
├─ netlify.toml
└─ styles.css
```

## Bật admin trên Netlify

### 1. Vào Netlify site

Mở Netlify Dashboard, chọn site:

```text
thunderous-seahorse-11fa34
```

### 2. Bật Identity

Vào:

```text
Site configuration > Identity
```

Bấm:

```text
Enable Identity
```

### 3. Chỉ cho người được mời đăng ký

Trong Identity settings, đặt:

```text
Registration preferences: Invite only
```

### 4. Bật Git Gateway

Vào:

```text
Site configuration > Identity > Services
```

Bật:

```text
Git Gateway
```

Git Gateway là phần cho phép admin sửa nội dung và commit ngược về GitHub.

### 5. Mời tài khoản admin

Vào:

```text
Identity > Invite users
```

Mời email:

```text
haotranq1234@gmail.com
```

Mở email mời, đặt mật khẩu, rồi đăng nhập tại:

```text
https://thunderous-seahorse-11fa34.netlify.app/admin
```

## Cách sửa sản phẩm

1. Vào `/admin`.
2. Đăng nhập bằng tài khoản đã được Netlify mời.
3. Chọn `San pham`.
4. Thêm, sửa, xóa sản phẩm trong danh sách.
5. Upload ảnh sản phẩm nếu cần.
6. Bấm `Publish`.

Sau khi publish, Netlify sẽ tự deploy lại. Thường mất khoảng vài chục giây.

## Dữ liệu sản phẩm

Mỗi sản phẩm trong `data/products.json` có các trường:

- `id`
- `name`
- `price`
- `description`
- `image`
- `category`
- `badge`
- `buyLink`
- `isActive`
- `createdAt`
- `updatedAt`

Nếu `isActive` là `false`, sản phẩm sẽ không hiện trên trang chủ.

## Chạy local

Site này là static website, có thể chạy bằng server tĩnh:

```bash
python -m http.server 8000
```

Sau đó mở:

```text
http://localhost:8000
```

Admin Decap CMS hoạt động tốt nhất khi chạy trên Netlify vì cần Identity + Git Gateway.

## Ghi chú

- Không còn dùng Firebase.
- Không cần Firestore.
- Không cần Firebase Storage.
- Không cần biến môi trường.
- Ảnh upload từ admin sẽ được lưu vào `assets/uploads/`.
