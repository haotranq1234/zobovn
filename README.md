# ZOBO VN

Website ZOBO VN hiện tại đã được nâng cấp thành landing page + admin dashboard dùng Firebase.

- Trang chủ đọc sản phẩm trực tiếp từ Firestore.
- Trang quản trị nằm ở `/admin`.
- Admin đăng nhập bằng Firebase Authentication email/password.
- Ảnh sản phẩm upload lên Firebase Storage.
- Site sẵn sàng deploy lên Vercel.

## Tính năng

- Giữ nguyên phong cách thiết kế hiện tại: premium, tối, hiện đại, mobile-first.
- Trang chủ vẫn có hero, sản phẩm nổi bật, lý do chọn ZOBO, liên hệ, CTA nổi.
- Sản phẩm không còn hardcode trong code giao diện.
- Admin dashboard có:
  - Danh sách sản phẩm
  - Thêm sản phẩm
  - Sửa sản phẩm
  - Xóa sản phẩm
  - Upload ảnh
  - Bật/tắt sản phẩm
  - Preview ảnh
  - Tìm kiếm sản phẩm
  - Nạp dữ liệu mẫu ban đầu

## Cấu trúc thư mục

```text
.
├─ index.html
├─ admin/
│  ├─ index.html
│  ├─ admin.css
│  └─ admin.js
├─ api/
│  └─ firebase-config.js
├─ js/
│  ├─ data.js
│  ├─ firebase.js
│  └─ main.js
├─ assets/
│  ├─ logo.png
│  ├─ favicon.svg
│  └─ products/
│     ├─ full-size-pack.png
│     ├─ combo-5-in-1.png
│     ├─ physical-filter-series.png
│     ├─ multi-size-physical.png
│     └─ full-size-5pcs.png
├─ firestore.rules
├─ storage.rules
├─ vercel.json
├─ .env.example
└─ styles.css
```

## Chạy local

Vì project có API route `/api/firebase-config`, cách chạy đúng là dùng Vercel CLI.

### 1. Cài Vercel CLI

```bash
npm i -g vercel
```

### 2. Tạo file `.env`

Copy `.env.example` thành `.env.local` và điền giá trị Firebase thật.

### 3. Chạy local

```bash
vercel dev
```

Sau đó mở:

- Trang chủ: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Cấu hình Firebase

### 1. Tạo Firebase Project

- Vào Firebase Console và tạo project mới.
- Bật Web App để lấy cấu hình Firebase.

### 2. Bật Authentication

- Vào **Authentication**.
- Bật **Email/Password**.
- Tạo tài khoản admin với email khớp biến `ADMIN_EMAIL`.

Mặc định repo đang dùng:

- `admin@zobovn.store`

Nếu đổi email admin, bạn phải cập nhật đồng bộ:

- `ADMIN_EMAIL` trong `.env`
- `firestore.rules`
- `storage.rules`

### 3. Bật Firestore

- Tạo Firestore Database.
- Chọn mode phù hợp với project của bạn.
- Collection cần dùng: `products`

Mỗi document sản phẩm nên có các field:

- `id`
- `name`
- `price`
- `description`
- `image`
- `category`
- `badge`
- `buyLink`
- `createdAt`
- `updatedAt`
- `isActive`

Lưu ý:

- `image` là URL ảnh từ Firebase Storage.
- `isActive = true` thì sản phẩm mới hiển thị trên homepage.
- Code cũng lưu thêm `imagePath` để xóa ảnh cũ trong Storage khi cần.

### 4. Bật Storage

- Vào **Storage** và bật bucket.
- Ảnh từ admin sẽ được upload lên đây.

### 5. Import rules

Mở file sau trong repo:

- [firestore.rules](./firestore.rules)
- [storage.rules](./storage.rules)

Rồi dán vào phần Rules tương ứng trong Firebase Console.

## Biến môi trường

Tạo `.env.local` từ `.env.example` với các biến:

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
ADMIN_EMAIL=
```

## Cấu hình Vercel

### 1. Kết nối repo

- Push code lên GitHub.
- Import repo vào Vercel.

### 2. Add Environment Variables

Thêm các biến ở mục Environment Variables trong Vercel Project Settings.

### 3. Deploy

- Vercel sẽ tự phát hiện static site + API route `/api/firebase-config`.
- Route `/admin` đã được cấu hình trong `vercel.json`.

## Cách dùng admin dashboard

### Đăng nhập

- Mở `/admin`
- Đăng nhập bằng email/password Firebase Authentication

### Nạp dữ liệu mẫu ban đầu

Khi Firestore chưa có sản phẩm, bấm **Nạp dữ liệu mẫu** trong admin.

Nút này sẽ:

- Lấy ảnh mẫu từ repo
- Upload ảnh lên Firebase Storage
- Tạo document trong Firestore

Sau khi bạn thay bằng ảnh thật riêng của bạn, chỉ cần sửa sản phẩm ngay trong admin.

### Thêm sản phẩm

- Điền form bên phải
- Upload ảnh
- Bấm lưu

### Sửa sản phẩm

- Bấm nút **Sửa** ở danh sách
- Chỉnh thông tin
- Bấm cập nhật

### Xóa sản phẩm

- Bấm **Xóa**
- Xác nhận thao tác

### Bật / tắt sản phẩm

- Dùng công tắc **Hiển thị**
- Khi tắt, sản phẩm sẽ không còn xuất hiện ở homepage

## Lưu ý về hình ảnh

- Homepage không đọc ảnh trực tiếp từ repository.
- Ảnh hiển thị trên site lấy từ Firebase Storage.
- Các file ảnh mẫu trong repo chỉ phục vụ bước nạp dữ liệu ban đầu.

## Deploy trên Vercel

1. Push code lên GitHub branch `main`.
2. Import repo vào Vercel.
3. Thêm biến môi trường.
4. Deploy.
5. Truy cập:
   - Trang chủ: `/`
   - Admin: `/admin`

## Gợi ý kiểm tra sau deploy

- Trang chủ load được sản phẩm từ Firestore.
- `/admin` mở được form login.
- Đăng nhập xong có thể thêm/sửa/xóa sản phẩm.
- Upload ảnh lên Storage thành công.
- Bật/tắt sản phẩm xong homepage cập nhật.

## Ghi chú kỹ thuật

- Không dùng framework nặng để giữ tốc độ tải tốt.
- Firebase config không hardcode trong source; được đọc từ API route `/api/firebase-config`.
- Homepage dùng realtime listener để cập nhật sản phẩm ngay khi admin thay đổi dữ liệu.
