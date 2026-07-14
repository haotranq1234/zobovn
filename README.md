# ZOBO VN

Website landing page ZOBO VN chạy trên Netlify, có trang quản trị `/admin` bằng Decap CMS.

Bạn có thể thêm, sửa, xóa sản phẩm và quản lý nhiều phần của website từ giao diện admin mà không cần sửa code thủ công.

## Cách hoạt động

- Trang chủ đọc nội dung từ các file trong thư mục `data/`.
- Trang `/admin` dùng Decap CMS để sửa dữ liệu và upload ảnh/video.
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
│  ├─ products.json
│  ├─ content.json
│  ├─ settings.json
│  ├─ social.json
│  ├─ banners.json
│  ├─ vouchers.json
│  ├─ categories.json
│  ├─ popup.json
│  ├─ seo.json
│  └─ media.json
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

## Các mục trong ZOBO CMS

Trong `/admin` sẽ có các mục:

- `Dashboard`: ghi chú nội bộ và việc cần làm.
- `Sản phẩm`: thêm, sửa, xóa sản phẩm, ảnh, video, trạng thái hiển thị và đánh dấu bán chạy.
- `Banner`: quản lý banner nổi bật trên website.
- `Nội dung website`: sửa text hero, khu sản phẩm, khu lợi ích và khu liên hệ.
- `Facebook / TikTok / YouTube / Zalo`: sửa link social và link đặt hàng.
- `Voucher`: tạo mã ưu đãi hoặc chương trình khuyến mãi.
- `Danh mục`: quản lý danh mục sản phẩm.
- `Popup khuyến mãi`: bật/tắt popup khuyến mãi.
- `Thư viện ảnh`: lưu ảnh/video quan trọng kèm ghi chú.
- `Cài đặt website`: sửa tên thương hiệu, địa điểm, logo, domain.
- `SEO`: sửa title, description và ảnh chia sẻ mạng xã hội.
- `Quản lý tài khoản`: hướng dẫn quản lý tài khoản admin qua Netlify Identity.

## Cách sửa sản phẩm

1. Vào `/admin`.
2. Đăng nhập bằng tài khoản đã được Netlify mời.
3. Chọn `Sản phẩm`.
4. Thêm, sửa, xóa sản phẩm trong danh sách.
5. Upload ảnh đại diện, thêm nhiều ảnh/video trong `Thư viện ảnh/video` nếu cần.
6. Bấm `Publish`.

Sau khi publish, Netlify sẽ tự deploy lại. Thường mất khoảng vài chục giây.

## Dữ liệu sản phẩm

Mỗi sản phẩm trong `data/products.json` có các trường:

- `id`
- `name`
- `price`
- `description`
- `image`
- `gallery`
- `category`
- `badge`
- `isBestSeller`
- `buyLink`
- `isActive`
- `createdAt`
- `updatedAt`

Nếu `isActive` là `false`, sản phẩm sẽ không hiện trên trang chủ.

### Thêm nhiều ảnh hoặc video cho một sản phẩm

Trong trang admin, mở sản phẩm rồi tìm mục:

```text
Thư viện ảnh/video
```

Mỗi item trong thư viện có:

- `Loại media`: chọn `Ảnh` hoặc `Video`
- `File ảnh/video`: upload file từ máy
- `Tiêu đề media`: tên ngắn để dễ nhận biết
- `Ảnh poster cho video`: không bắt buộc, dùng làm ảnh chờ trước khi phát video

Video nên dùng định dạng `.mp4` để chạy ổn trên hầu hết trình duyệt.

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
