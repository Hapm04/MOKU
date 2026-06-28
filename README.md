# MOKU Wood Layout Bilingual Website

Bộ source website tĩnh song ngữ Anh/Việt cho MOKU Kitchenware, lấy bố cục từ mẫu `woodstore.zip` và giữ yêu cầu trước đó: mỗi trang nằm trong folder riêng, có logo MOKU, mặc định tiếng Anh khi vào lần đầu, có nút chuyển EN/VI và các link báo giá/liên hệ để sửa trong code.

## Cấu trúc

```text
moku-wood-layout-bilingual-website/
├── index.html
├── trang-chu/index.html
├── gioi-thieu/index.html
├── san-pham/index.html
├── tin-tuc/index.html
├── lien-he/index.html
├── 404.html
└── assets/
    ├── css/style.css
    ├── js/config.js
    ├── js/content.js
    ├── js/main.js
    └── images/
```

## Sửa link liên hệ / báo giá

Mở file:

```text
assets/js/config.js
```

Thay các giá trị sau:

```js
quoteLink: "https://zalo.me/your-zalo-id",
zaloLink: "https://zalo.me/your-zalo-id",
messengerLink: "https://m.me/your-page-id",
mapLink: "https://maps.google.com/?q=..."
```


## Sửa giá sản phẩm / giỏ hàng

Giá sản phẩm đang đặt trong file:

```text
assets/js/content.js
```

Tìm các dòng `price:189000`, `price:27000`... và thay bằng giá thật của bạn. Giỏ hàng hiện là giỏ hàng tĩnh chạy bằng `localStorage`: khách có thể thêm sản phẩm, tăng/giảm số lượng, xóa sản phẩm và xem tổng tạm tính. Nút gửi yêu cầu báo giá trong giỏ hàng sẽ mở link `quoteLink` trong `assets/js/config.js`.

## Sửa nội dung Anh / Việt

Mở file:

```text
assets/js/content.js
```

## Deploy GitHub Pages

1. Giải nén source.
2. Push toàn bộ thư mục lên GitHub repository.
3. Vào Settings → Pages.
4. Chọn branch `main` và folder `/root`.
5. Save và chờ GitHub Pages tạo link.
