---
description: "Phân tích SWOT ngành nghề kinh doanh, vị thế cạnh tranh và chuỗi đối tác mua bán trên SME Connect"
always: false
---

# smec-industry

1. Đọc thông tin ngành nghề (mã VSIC), mô hình kinh doanh và danh sách đối tác đầu ra/đầu vào từ `sme_case_get` + `sme_evidence_get`.
2. Trình bày phân tích SWOT thực chất gắn với mã bằng chứng `E###` của hồ sơ.
3. Lưu kết quả qua `sme_case_put_result(agent="industry")`.
