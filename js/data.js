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
    description: "Thiết kế nhỏ gọn, tháo rời thuận tiện cho việc vệ sinh và tái sử dụng.",
    badge: "Bán chạy",
    image: "assets/products/full-size.svg",
    imageAlt: "Sản phẩm đầu lọc thuốc lá Full Size của ZOBO VN",
    features: [
      "Thiết kế gọn gàng, phù hợp cho trải nghiệm mang theo hằng ngày.",
      "Cấu trúc tháo rời hỗ trợ vệ sinh thuận tiện hơn.",
      "Phù hợp cho người cần một lựa chọn đơn giản, dễ sử dụng.",
    ],
  },
  {
    id: "multi-size",
    name: "Đầu lọc thuốc lá nhiều kích thước",
    description: "Phiên bản linh hoạt cho các nhu cầu sử dụng khác nhau, giữ bố cục nhỏ gọn.",
    badge: "Linh hoạt",
    image: "assets/products/multi-size.svg",
    imageAlt: "Sản phẩm đầu lọc thuốc lá nhiều kích thước của ZOBO VN",
    features: [
      "Nhiều tuỳ chọn kích thước theo từng mẫu.",
      "Kết cấu chắc chắn, dễ cầm nắm và thao tác.",
      "Phù hợp trưng bày trong nhóm sản phẩm đa dạng.",
    ],
  },
  {
    id: "zobo-pipe",
    name: "Tẩu lọc thuốc lá ZOBO",
    description: "Thiết kế đặc trưng của thương hiệu, tối ưu cảm giác hiện đại và dễ mang theo.",
    badge: "Signature",
    image: "assets/products/zobo-pipe.svg",
    imageAlt: "Sản phẩm tẩu lọc thuốc lá ZOBO",
    features: [
      "Phong cách tối giản nhưng vẫn đủ nhận diện thương hiệu.",
      "Có thể tháo rời để hỗ trợ vệ sinh tốt hơn.",
      "Tạo cảm giác cao cấp khi khách xem trên landing page.",
    ],
  },
  {
    id: "slim",
    name: "Tẩu lọc thiết kế dạng slim",
    description: "Kiểu dáng slim hiện đại, tiện lợi khi mang theo và không chiếm nhiều không gian.",
    badge: "Slim",
    image: "assets/products/slim-design.svg",
    imageAlt: "Sản phẩm tẩu lọc thiết kế dạng slim của ZOBO VN",
    features: [
      "Đường nét mảnh, phù hợp với bố cục premium.",
      "Dễ cầm, dễ mang theo trong túi hoặc hộp nhỏ.",
      "Màu sắc tinh gọn, tạo cảm giác chỉn chu hơn.",
    ],
  },
  {
    id: "color-series",
    name: "Các mẫu tẩu lọc nhiều màu",
    description: "Bộ sưu tập màu đen, hồng và các phiên bản khác để khách dễ chọn theo gu cá nhân.",
    badge: "Nhiều màu",
    image: "assets/products/color-series.svg",
    imageAlt: "Bộ sưu tập tẩu lọc nhiều màu của ZOBO VN",
    features: [
      "Nhiều phiên bản màu để dễ tạo sự khác biệt.",
      "Có thể kết hợp cùng các dòng sản phẩm khác trong catalogue.",
      "Hợp với cách trưng bày theo bộ sưu tập.",
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
