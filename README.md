# ZOBO VN

Website landing page/bio commerce chính thức cho thương hiệu ZOBO VN. Dự án được dựng bằng HTML, CSS và JavaScript thuần để dễ bảo trì, tải nhanh và triển khai lên GitHub Pages.

## Tính năng chính

- Giao diện mobile-first, tối ưu cho khách từ Facebook và TikTok.
- Hero section rõ CTA.
- Sản phẩm được render từ dữ liệu riêng, dễ thêm/xóa.
- Section lý do chọn ZOBO với icon hiện đại.
- Khu vực liên hệ với nút lớn, dễ bấm.
- Floating CTA trên mobile.
- SEO cơ bản: title, description, canonical, Open Graph, favicon, sitemap, robots.
- Tương thích GitHub Pages và sẵn `CNAME` cho `zobovn.store`.

## Cấu trúc thư mục

```text
.
├─ index.html
├─ styles.css
├─ js/
│  ├─ data.js
│  └─ main.js
├─ assets/
│  ├─ brand-mark.svg
│  ├─ favicon.svg
│  ├─ og-image.svg
│  └─ products/
│     ├─ full-size.svg
│     ├─ multi-size.svg
│     ├─ zobo-pipe.svg
│     ├─ slim-design.svg
│     └─ color-series.svg
├─ CNAME
├─ robots.txt
└─ sitemap.xml
```

## Chạy website local

Bạn không cần cài dependency nào.

### Cách 1: mở trực tiếp

- Mở `index.html` bằng trình duyệt.

### Cách 2: chạy bằng server tĩnh

```bash
python -m http.server 8000
```

Sau đó mở `http://localhost:8000`.

Nếu muốn dùng Node:

```bash
npx serve .
```

## Cách thay logo

- Logo chính nằm ở `assets/brand-mark.svg`.
- Favicon nằm ở `assets/favicon.svg`.
- Nếu muốn thay bằng ảnh khác, cập nhật luôn đường dẫn trong `index.html`.

## Cách thay ảnh sản phẩm

- Ảnh sản phẩm nằm trong `assets/products/`.
- Mỗi sản phẩm đang dùng một file SVG riêng để dễ thay thế.
- Chỉ cần thay file tương ứng hoặc đổi đường dẫn trong `js/data.js`.

## Cách thêm sản phẩm

Mở `js/data.js` và thêm một object mới vào mảng `products`.

Mỗi sản phẩm nên có các trường:

- `id`
- `name`
- `description`
- `badge`
- `image`
- `imageAlt`
- `features`

Ví dụ:

```js
{
  id: "new-product",
  name: "Tên sản phẩm mới",
  description: "Mô tả ngắn",
  badge: "Mới",
  image: "assets/products/new-product.svg",
  imageAlt: "Mô tả ảnh",
  features: [
    "Điểm nổi bật 1",
    "Điểm nổi bật 2",
    "Điểm nổi bật 3",
  ],
}
```

## Cách sửa link Facebook

Mở `js/data.js` và chỉnh:

```js
siteConfig.links.facebook
```

## Cách sửa link Messenger

Mở `js/data.js` và chỉnh:

```js
siteConfig.links.messenger
```

## Cách sửa link TikTok

Mở `js/data.js` và chỉnh:

```js
siteConfig.links.tiktok
```

## Cách sửa link đặt hàng

Mở `js/data.js` và chỉnh:

```js
siteConfig.links.order
```

Nút `Đặt hàng ngay` ở hero, floating CTA và nút trong card sản phẩm đều đang dùng link này.

## Cách deploy lên GitHub Pages

1. Push code lên repository GitHub.
2. Vào `Settings` của repository.
3. Chọn `Pages`.
4. Ở `Build and deployment`, chọn nguồn publish là branch bạn dùng, thường là `main` hoặc `master`, và thư mục `/(root)`.
5. Đợi GitHub build xong và cấp URL Pages.
6. Nếu dùng custom domain, giữ file `CNAME` ở root repository.

Theo tài liệu GitHub Pages, custom domain cho apex domain cần cấu hình bản ghi `A`, `ALIAS` hoặc `ANAME`; subdomain dùng `CNAME`. GitHub cũng khuyến nghị dùng thêm `www` nếu có thể.

## Cách kết nối domain `zobovn.store`

### 1. Cấu hình trong GitHub

- Vào `Settings > Pages`.
- Nhập custom domain là `zobovn.store`.
- Lưu lại và chờ GitHub xác nhận.

### 2. Giữ file `CNAME`

File `CNAME` ở root repo phải chứa đúng một dòng:

```text
zobovn.store
```

### 3. Cấu hình DNS

Nếu dùng apex domain `zobovn.store`, hãy trỏ DNS về GitHub Pages.

Theo tài liệu GitHub Pages, các bản ghi `A` cho apex domain là:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Nếu bạn dùng thêm `www.zobovn.store`, hãy tạo bản ghi `CNAME` trỏ `www` về domain GitHub Pages của bạn.

### 4. Bật HTTPS

- Sau khi DNS đúng, quay lại `Settings > Pages`.
- Bật `Enforce HTTPS` khi tùy chọn này xuất hiện.
- GitHub có thể mất một thời gian ngắn để cấp chứng chỉ.

## Lưu ý nội dung

- Không dùng các câu khẳng định y tế hoặc cam kết sức khỏe tuyệt đối.
- Nội dung hiện tại mô tả trung tính và tập trung vào trải nghiệm sản phẩm.

## Mở rộng trong tương lai

- Thêm trang chi tiết riêng cho từng sản phẩm.
- Kết nối form đặt hàng thực tế.
- Thêm tracking chuyển đổi nếu cần.
- Bổ sung ảnh thật thay cho placeholder SVG.
