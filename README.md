# On tap Lich su Dang

Trang web trac nghiem don gian, chay offline bang HTML/CSS/JavaScript thuan.

## Cach chay

Mo file `index.html` bang trinh duyet.

## Cach cap nhat cau hoi theo chuong

Du lieu goc nam trong thu muc `question`:

- `question/chuong1`
- `question/chuong2`
- `question/chuong3`

Moi file crawler tu LMS co dang `window.QUESTIONS = [...]`. App coi:

- `options[0]` la noi dung cau hoi
- `options[1]` la dap an dung trong du lieu goc
- cac phan tu sau do la cac dap an con lai

Sau khi them/sua file trong `question`, chay:

```bash
node build-chapters.js
```

Lenh nay tao lai `chapters.js` cho web. Khi lam bai, app se tron thu tu cau hoi va tron ca thu tu dap an,
nhung van giu dung dap an dung sau khi tron.

## Cach lay cau hoi tu LMS

Trang LMS can phien dang nhap, nen request truc tiep tu ben ngoai co the bi redirect ve `/my-learning`.
Dung cach an toan sau:

1. Mo trang quiz tren LMS bang trinh duyet da dang nhap.
2. Bam `F12` de mo DevTools.
3. Vao tab `Console`.
4. Mo file `lms-extractor.js`, copy toan bo noi dung va paste vao Console.
5. Bam `Enter`.
6. Trinh duyet se tai ve file `questions.js`.
7. Chep file vua tai ve vao dung thu muc chuong, vi du `question/chuong1`.
8. Chay `node build-chapters.js`.

Khong can luu tai khoan, mat khau, hoac cookie LMS trong source code.

## Kiem tra logic

Neu may co Node.js, chay:

```bash
node quiz-core.test.js
```
