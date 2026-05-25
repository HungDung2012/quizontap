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


## Kiểm tra logic

Nếu máy có Node.js, chạy:

```bash
node quiz-core.test.js
```
