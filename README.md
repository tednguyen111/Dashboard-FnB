# Room Occupancy Analytics: Phân tích độ phủ phòng cho quán thu âm, karaoke

Prototype mở rộng màn hình Tổng quan của phần mềm quản lý F&B (theo phong cách KiotViet) dành cho mô hình **kinh doanh theo phòng**: music box, phòng thu âm, karaoke.

> Đây là dự án portfolio Business Analyst cá nhân, không liên kết với KiotViet. Dữ liệu trong prototype là dữ liệu mẫu.

[Ảnh: Toàn cảnh màn hình Tổng quan, có 2 widget mới]

---

## Mục lục

1. [Bài toán](#1-bài-toán)
2. [Giải pháp](#2-giải-pháp)
3. [Persona](#3-persona)
4. [Tính năng](#4-tính-năng)
5. [Hướng dẫn demo](#5-hướng-dẫn-demo)
6. [Cài đặt và chạy](#6-cài-đặt-và-chạy)
7. [Mapping User Story và prototype](#7-mapping-user-story-và-prototype)
8. [Giả định, giới hạn và câu hỏi mở](#8-giả-định-giới-hạn-và-câu-hỏi-mở)
9. [Cấu trúc thư mục](#9-cấu-trúc-thư-mục)

---

## 1. Bài toán

Phần mềm quản lý bán hàng hiện ghi nhận **giờ tạo hóa đơn**, không ghi nhận **thời gian khách thực sự ở trong phòng**.

Với mô hình cho thuê theo giờ, dữ liệu này bị lệch. Ví dụ khách vào phòng lúc 19:00, dùng đến 22:00 rồi mới thanh toán. Hệ thống chỉ thấy một hóa đơn lúc 22:00, nên khung 19:00 – 22:00 trông như **phòng trống**.

Hậu quả là chủ quán không trả lời được những câu hỏi cơ bản:

- Khung giờ nào trong tuần đông, khung nào vắng, để chạy khuyến mãi?
- Khách thường ngồi bao lâu ở mỗi loại phòng, để thiết kế gói combo?
- Phòng nào sắp hết combo, phòng nào bị bỏ quên chưa trả?

Màn hình hiện tại chỉ có trạng thái tức thời (ví dụ 8/10 phòng đang có khách), không có lịch sử và không có cảnh báo.

## 2. Giải pháp

Tính toán dựa trên **giờ nhận phòng và giờ trả phòng**, không dựa trên giờ tạo hóa đơn, rồi bổ sung:

| Nhóm | Tính năng |
|---|---|
| Phân tích | Heatmap mật độ sử dụng phòng (thứ × giờ), widget thời gian sử dụng trung bình theo loại phòng |
| Vận hành | Cảnh báo trên sơ đồ phòng: Mức 1 combo sắp hết, Mức 2 thời gian sử dụng bất thường |
| Thông báo | Thông báo đẩy tới điện thoại Quản lý: kín phòng, Mức 1, Mức 2 |
| Di động | Màn hình mật độ phòng trên điện thoại cho chủ quán xem từ xa |

## 3. Persona

| | Persona 1: Chủ quán | Persona 2: Quản lý ca | Nhân viên thu ngân |
|---|---|---|---|
| Tần suất | Vài lần mỗi tuần | Hằng ngày | Liên tục trong ca |
| Thiết bị | Chủ yếu điện thoại, thường ở xa | Máy tính tại quầy | Máy tính tại quầy |
| Mục tiêu | Chiến lược: giá, combo, khuyến mãi | Vận hành: xử lý cảnh báo, triển khai khuyến mãi | Phục vụ khách, nhắc khách khi combo sắp hết |
| Thấy được | Toàn bộ | Toàn bộ | Chỉ cảnh báo Mức 1 trên sơ đồ phòng |

## 4. Tính năng

Các tính năng mới được đánh dấu **chấm vàng** trên menu và **nhãn "Mới"** trên widget, để người xem biết nên bấm vào đâu.

[Ảnh: Thanh menu có chấm vàng đánh dấu tính năng mới]

### 4.1 Widget tỷ lệ phủ phòng (US-001)

Thẻ trên Tổng quan hiển thị % phòng đang có khách, số phòng có khách / tổng số phòng và tổng tạm tính. Bấm vào thẻ để mở sơ đồ phòng.

### 4.2 Heatmap mật độ sử dụng phòng (US-002)

- **Mặc định thu gọn:** chỉ hiện 3 số liệu (tỷ lệ phủ trung bình, khung giờ cao điểm, khung giờ vắng nhất) để không làm rối Tổng quan.
- **Bấm vào dòng số liệu:** mở heatmap 7 × 24 ngay trong thẻ. Ô chỉ có màu, không có số. Rê chuột vào ô để xem chi tiết.
- **Chọn khoảng thời gian:** 7 ngày, 4 tuần, tháng này, tháng trước, 3 tháng hoặc **Tùy chọn** (từ ngày – đến ngày, tối thiểu 7 ngày, trong 90 ngày gần nhất).
- **"Xem chi tiết theo loại phòng":** mở trang đầy đủ, có lọc theo loại phòng, xuất file và bảng chi tiết khi bấm vào một ô.

[Ảnh: Widget heatmap ở trạng thái thu gọn]

[Ảnh: Widget heatmap đã mở, đang rê chuột vào một ô]

[Ảnh: Trang chi tiết mật độ sử dụng phòng, đang chọn một ô]

[Ảnh: Bộ chọn ngày "Tùy chọn" đang báo lỗi "Chọn ít nhất 7 ngày"]

### 4.3 Thời gian sử dụng trung bình (US-003)

- Thời gian trung bình toàn quán, chênh lệch so với kỳ trước và tổng số lượt.
- Thanh ngang cho từng loại phòng. Vạch nét đứt đánh dấu trung bình toàn quán.
- Loại phòng có dưới 5 lượt hiện nhãn **"Ít dữ liệu"**.
- Không tính lượt dưới 10 phút và lượt bị cảnh báo Mức 2.

[Ảnh: Widget thời gian sử dụng trung bình, có nhãn "Ít dữ liệu"]

### 4.4 Sơ đồ phòng và cảnh báo (US-005)

Màn hình Phòng/Bàn được làm theo kiểu màn hình Thu ngân: mỗi phòng là một ô hình bàn. Bấm vào phòng để xem đơn ở khung bên phải.

| Mức | Điều kiện (mặc định) | Hiển thị | Ai thấy |
|---|---|---|---|
| Mức 1, combo sắp hết | Combo còn ≤ 15 phút | Ô màu cam, nhãn "Còn Xp" | Tất cả nhân viên |
| Mức 2, bất thường | Phòng dùng liên tục ≥ 12 giờ | Ô màu đỏ, nhãn "Bất thường" có chấm nhấp nháy | Chỉ Quản lý |

- Nút tóm tắt "1 bất thường | 2 sắp hết combo" để lọc nhanh các phòng có cảnh báo.
- Chuông trên thanh đầu trang liệt kê cảnh báo. Bấm vào một cảnh báo để chuyển tới đúng phòng đó.

[Ảnh: Sơ đồ phòng khi xem với vai trò Quản lý, thấy cả Mức 1 và Mức 2]

[Ảnh: Sơ đồ phòng khi xem với vai trò Nhân viên, Mức 2 bị ẩn]

[Ảnh: Danh sách cảnh báo mở từ chuông thông báo]

### 4.5 Cài đặt thông báo và ngưỡng (US-006)

- Bật/tắt thông báo kín phòng.
- Mức 1: bật/tắt, số phút báo trước khi combo kết thúc (1–120), gửi tới app.
- Mức 2: bật/tắt, ngưỡng giờ (1–48, mặc định 12, có nút khôi phục mặc định), gửi tới app.
- Kiểm tra dữ liệu nhập. Trước khi lưu, trang cho xem trước số phòng sẽ bị cảnh báo với ngưỡng mới.
- Nhân viên không chỉnh được cài đặt.

[Ảnh: Trang Cài đặt thông báo]

[Ảnh: Ô nhập ngưỡng đang báo lỗi]

### 4.6 Điện thoại của Quản lý (US-004, US-005, US-006, US-007)

Trang `thong-bao-dien-thoai.html` gồm 4 màn hình tương tác:

1. **Màn hình khóa:** thông báo kín phòng, Mức 1, Mức 2 lần lượt hiện ra. Có nút "Phát lại thông báo".
2. **Danh sách thông báo trong app:** bấm một thông báo để mở bảng tóm tắt phòng.
3. **Cài đặt thông báo cá nhân:** tắt một loại thì thông báo loại đó biến mất ở màn hình 1 và 2.
4. **Mật độ phòng (US-007):** 3 số liệu chính, so sánh hôm nay với cùng thứ tuần trước, heatmap 7 × 16 cột giờ mở cửa (chạm ô để xem chi tiết), tỷ lệ phủ theo loại phòng.

[Ảnh: 4 màn hình điện thoại đặt cạnh nhau]

[Ảnh: Màn hình Mật độ phòng trên điện thoại, đang chọn một ô]

## 5. Hướng dẫn demo

Kịch bản gợi ý cho buổi thuyết trình, khoảng 5–7 phút:

1. **Tổng quan:** giới thiệu bài toán, chỉ vào 2 widget có nhãn "Mới".
2. **Bấm dòng số liệu của heatmap** để mở lưới, rê chuột vào khung T7 20:00, rồi đổi khoảng thời gian.
3. **Bấm "Xem chi tiết theo loại phòng"**, lọc Phòng VIP, bấm vào một ô.
4. **Widget thời gian trung bình:** chọn "Hôm nay" để thấy nhãn "Ít dữ liệu".
5. **Phòng/Bàn:** chỉ ra Phòng 02, 04 (Mức 1) và Phòng 06 (Mức 2), bấm vào Phòng 06.
6. **Đổi vai trò sang "Nhân viên"** (nút góc dưới bên trái): Mức 2 biến mất.
7. **Cài đặt:** đổi ngưỡng Mức 2 thành 13 giờ rồi lưu, quay lại Phòng/Bàn thấy cảnh báo Mức 2 biến mất.
8. **Bấm "Xem trên điện thoại"** (góc dưới bên trái) để mở trang điện thoại, bấm "Phát lại thông báo".

[Ảnh: Nút đổi vai trò và đường dẫn "Xem trên điện thoại" ở góc dưới bên trái]

## 6. Cài đặt và chạy

Yêu cầu: Node.js 18 trở lên.

```bash
npm install
npm run dev        # mở http://localhost:3000
npm run build      # tạo bản tĩnh trong thư mục dist/
```

| Đường dẫn | Màn hình |
|---|---|
| `#/tong-quan` | Tổng quan |
| `#/mat-do-phong` | Chi tiết mật độ sử dụng phòng |
| `#/phong-ban` | Phòng/Bàn |
| `#/cai-dat-thong-bao` | Cài đặt thông báo |
| `/thong-bao-dien-thoai.html` | Điện thoại của Quản lý (tương tác) |
| `/thong-bao-dien-thoai-figma.html` | Bản tĩnh để import vào Figma |

### Import vào Figma

File `thong-bao-dien-thoai-figma.html` được viết để các plugin chuyển HTML sang Figma (ví dụ html.to.design) giữ bố cục tốt nhất: không dùng JavaScript, chỉ dùng flexbox, không dùng pseudo-element hay hiệu ứng làm mờ nền, và mỗi màn hình là một khung iPhone 393 × 852. Sau khi import, nên tự tạo Component cho các phần lặp lại (thẻ thông báo, dòng danh sách, công tắc).

## 7. Mapping User Story và prototype

Tài liệu đầy đủ: [`docs/User_Stories_v0.7.txt`](docs/User_Stories_v0.7.txt)

| US | Tên | Ưu tiên | Màn hình trong prototype |
|---|---|---|---|
| US-001 | Widget tỷ lệ phủ phòng | Must | Tổng quan |
| US-002 | Heatmap mật độ sử dụng phòng | Must | Tổng quan, trang chi tiết |
| US-003 | Thời gian sử dụng trung bình | Must | Tổng quan |
| US-004 | Thông báo kín phòng | Should | Điện thoại, màn hình 1–2 |
| US-005 | Cảnh báo phòng Mức 1 và Mức 2 | Should | Phòng/Bàn, chuông, điện thoại màn hình 1–2 |
| US-006 | Cài đặt thông báo và ngưỡng | Should | Cài đặt, điện thoại màn hình 3 |
| US-007 | Mật độ phòng trên điện thoại | Should | Điện thoại, màn hình 4 |
| US-008 | Thông báo tóm tắt tuần | Could (backlog) | Chưa làm |

[Ảnh: Story map hoặc sơ đồ luồng người dùng]

## 8. Giả định, giới hạn và câu hỏi mở

**Quy tắc nghiệp vụ chính**

- Thời gian sử dụng tính từ giờ nhận phòng đến giờ trả phòng.
- Tổng số phòng (N) lấy từ danh mục Phòng/Bàn có sẵn, tự cập nhật khi chủ quán thêm hoặc bớt phòng.
- Số liệu lịch sử tính theo số phòng tại thời điểm phát sinh.
- Phòng ngừng hoạt động không tính vào N và vẫn giữ lịch sử.

**Prototype chưa demo được**

- Cập nhật real-time khi nhận phòng hoặc trả phòng. Dữ liệu được cố định tại 22:40, 27/10/2026 để demo lặp lại được.
- Trạng thái 0 phòng có khách và ô heatmap chưa có dữ liệu.
- Cảnh báo biến mất khi trả phòng.
- Ẩn Tổng quan với Nhân viên.
- Số phòng thay đổi theo thời gian.

**Câu hỏi mở**

1. Danh mục Phòng/Bàn có trạng thái "ngừng hoạt động" cho từng phòng không?
2. Quản lý ca có được xuất file heatmap không, hay chỉ chủ quán?
3. Hệ thống đã ghi nhận sự kiện nhận phòng và trả phòng tách riêng với giờ tạo hóa đơn chưa? Toàn bộ số liệu dựa trên giả định này.

## 9. Cấu trúc thư mục

```
├── docs/
│   └── User_Stories_v0.7.txt          # Tài liệu User Story
├── public/
│   ├── thong-bao-dien-thoai.html      # Điện thoại của Quản lý (tương tác)
│   └── thong-bao-dien-thoai-figma.html  # Bản tĩnh cho Figma
├── src/
│   ├── App.tsx                        # Điều hướng, vai trò, trạng thái cài đặt
│   ├── index.css                      # Màu sắc, kiểu chữ, component dùng chung
│   ├── data/mockData.ts               # Dữ liệu mẫu: phòng, heatmap, thời gian TB
│   ├── lib/
│   │   ├── alerts.ts                  # Quy tắc cảnh báo Mức 1 và Mức 2
│   │   ├── heatmapStats.ts            # Tỷ lệ phủ TB, cao điểm, vắng nhất
│   │   └── format.ts                  # Định dạng thời gian và tiền
│   ├── components/
│   │   ├── AppHeader.tsx              # Thanh đầu trang, chuông, vai trò
│   │   ├── ui/                        # Dropdown, bộ chọn ngày, công tắc
│   │   └── widgets/                   # Heatmap, thời gian TB, biểu đồ
│   └── views/                         # Tổng quan, Chi tiết heatmap, Phòng/Bàn, Cài đặt
└── package.json
```

**Công nghệ:** React 19, TypeScript, Vite, Tailwind CSS v4, lucide-react.

---

**Tác giả:** Nguyễn Tuấn Đạt · Business Analyst
