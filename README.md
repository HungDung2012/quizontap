# Ôn tập Lịch sử Đảng

Trang web trắc nghiệm đơn giản, chạy offline bằng HTML/CSS/JavaScript thuần.

## Cách chạy

Mở file `index.html` bằng trình duyệt.

## Cách cập nhật câu hỏi theo chương

Dữ liệu gốc nằm trong thư mục `question`:

- `question/chuong1`
- `question/chuong2`
- `question/chuong3`

Mỗi file crawler từ LMS có dạng `window.QUESTIONS = [...]`. App hiểu dữ liệu như sau:

- `options[0]` là nội dung câu hỏi
- `options[1]` là đáp án đúng trong dữ liệu gốc
- các phần tử sau đó là các đáp án còn lại

Sau khi thêm/sửa file trong `question`, chạy:

```bash
node build-chapters.js
```

Lệnh này tạo lại `chapters.js` cho web. Khi làm bài, app sẽ trộn thứ tự câu hỏi và trộn cả thứ tự đáp án, nhưng vẫn giữ đúng đáp án sau khi trộn.

## Cách lấy câu hỏi từ LMS

Trang LMS cần phiên đăng nhập, nên request trực tiếp từ bên ngoài có thể bị redirect về `/my-learning`. Dùng cách an toàn sau:

1. Mở trang quiz trên LMS bằng trình duyệt đã đăng nhập.
2. Bấm `F12` để mở DevTools.
3. Vào tab `Console`.
4. Mở file `lms-extractor.js`, copy toàn bộ nội dung và paste vào Console.
5. Bấm `Enter`.
6. Trình duyệt sẽ tải về file `questions.js`.
7. Chép file vừa tải về vào đúng thư mục chương, ví dụ `question/chuong1`.
8. Chạy `node build-chapters.js`.

Không cần lưu tài khoản, mật khẩu hoặc cookie LMS trong source code.

## Kiểm tra logic

Nếu máy có Node.js, chạy:

```bash
node quiz-core.test.js
```
