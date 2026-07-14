export const siteConfig = {
  brandName: "ZOBO VN",
  location: "Biên Hòa, Việt Nam",
  domain: "zobovn.store",
  canonicalUrl: "https://zobovn.store/",
  year: 2026,
  links: {
    facebook: "https://www.facebook.com/zobovn",
    messenger: "https://m.me/zobovn",
    tiktok: "https://www.tiktok.com/@zobovn",
    order: "https://zobovn.store/dat-hang",
  },
};

export const products = [
  {
    id: "full-size",
    name: "Đầu lọc thuốc lá Full Size",
    description: "Bộ 5 đầu lọc Full Size, đóng gói gọn và dễ trưng bày.",
    badge: "Bán chạy",
    image: "assets/products/full-size-pack.png",
    imageAlt: "Bộ 5 đầu lọc thuốc lá Full Size của ZOBO VN",
    features: [
      "Thiết kế gọn gàng, phù hợp để trưng bày theo set.",
      "Hình ảnh sản phẩm rõ ràng, dễ nhận diện trên mobile.",
      "Hỗ trợ khách xem nhanh trước khi chuyển sang đặt hàng.",
    ],
  },
  {
    id: "combo-5-in-1",
    name: "Siêu Combo 5 in 1",
    description: "Bộ ảnh combo 5 mẫu cho nhiều size, bố cục rõ và dễ xem.",
    badge: "Combo",
    image: "assets/products/combo-5-in-1.png",
    imageAlt: "Siêu Combo 5 in 1 của ZOBO VN",
    features: [
      "Hỗ trợ nhiều size nhỏ, trung bình và thông thường.",
      "Phù hợp để giới thiệu một nhóm sản phẩm đa dạng.",
      "Bố cục ảnh tối ưu cho khách xem nhanh trên điện thoại.",
    ],
  },
  {
    id: "physical-filter",
    name: "Dòng sản phẩm lọc vật lý",
    description: "Mẫu sản phẩm mang phong cách hiện đại, dễ nhận diện theo từng phiên bản.",
    badge: "Signature",
    image: "assets/products/physical-filter-series.png",
    imageAlt: "Dòng sản phẩm tẩu thuốc lá lọc vật lý của ZOBO VN",
    features: [
      "Có nhiều phiên bản hiển thị trong một bố cục hình ảnh.",
      "Thiết kế thanh gọn, tạo cảm giác chỉn chu.",
      "Phù hợp làm card trưng bày trong landing page chính.",
    ],
  },
  {
    id: "slim",
    name: "Tẩu lọc Slim nhiều màu",
    description: "Mẫu slim với nhiều phiên bản màu, dễ chọn theo gu cá nhân.",
    badge: "Slim",
    image: "assets/products/multi-size-physical.png",
    imageAlt: "Tẩu lọc Slim nhiều màu của ZOBO VN",
    features: [
      "Nhiều phiên bản màu trong cùng một bố cục ảnh.",
      "Đường nét mảnh, hợp với phong cách premium.",
      "Dễ dùng làm ảnh sản phẩm trên mobile-first landing page.",
    ],
  },
  {
    id: "full-size-five-pcs",
    name: "Hộp 5 đầu lọc Full Size",
    description: "Phiên bản hộp 5 sản phẩm với bố cục rõ ràng, dễ nhìn.",
    badge: "5 PCS",
    image: "assets/products/full-size-5pcs.png",
    imageAlt: "Hộp 5 đầu lọc thuốc lá Full Size của ZOBO VN",
    features: [
      "Bố cục sản phẩm rõ ràng, nhấn mạnh số lượng hộp.",
      "Tạo cảm giác đầy đủ và dễ hiểu khi khách lướt nhanh.",
      "Có thể dùng như card chốt trong phần sản phẩm nổi bật.",
    ],
  },
];

export const benefits = [
  {
    title: "Thiết kế nhỏ gọn",
    description: "Không gian sản phẩm được xử lý tinh gọn, phù hợp với người xem trên màn hình điện thoại.",
    icon: "compact",
  },
  {
    title: "Dễ vệ sinh",
    description: "Các mẫu có thể tháo rời để việc vệ sinh và bảo quản thuận tiện hơn.",
    icon: "clean",
  },
  {
    title: "Nhiều mẫu lựa chọn",
    description: "Có nhiều kích thước và màu sắc để khách chọn theo nhu cầu thực tế.",
    icon: "collection",
  },
  {
    title: "Hỗ trợ khách hàng nhanh",
    description: "Nút liên hệ rõ ràng giúp khách chuyển ngay sang Facebook, Messenger hoặc TikTok.",
    icon: "support",
  },
];

export const contactChannels = [
  {
    title: "Facebook",
    description: "Xem cập nhật và inbox theo trang chính thức.",
    href: siteConfig.links.facebook,
    icon: "facebook",
  },
  {
    title: "Messenger",
    description: "Nhắn tin trực tiếp để được hỗ trợ nhanh hơn.",
    href: siteConfig.links.messenger,
    icon: "messenger",
  },
  {
    title: "TikTok",
    description: "Xem thêm nội dung ngắn và nhận diện sản phẩm.",
    href: siteConfig.links.tiktok,
    icon: "tiktok",
  },
  {
    title: "Đặt hàng",
    description: "Đi thẳng tới trang đặt hàng hoặc link chốt đơn.",
    href: siteConfig.links.order,
    icon: "order",
  },
];
