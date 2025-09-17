# Support Tickets Status Mapping

## Giải thích Status
- **`open`**: Ticket mới được tạo, chưa xử lý
- **`pending`**: Ticket đang được xử lý (in progress)
- **`resolved`**: Ticket đã được giải quyết thành công
- **`closed`**: Ticket đã đóng, không còn xử lý

## Vấn đề đã được fix
- ✅ Frontend sử dụng `pending` thay vì `in_progress` để phù hợp với database
- ✅ API stats trả về `pending_tickets` thay vì `in_progress_tickets`
- ✅ Dashboard hiển thị đúng số liệu ticket counts
- ✅ Nút "Mark In Progress" hoạt động bình thường

## Các thay đổi đã thực hiện

### Backend
- ✅ `updateTicketController.js`: Sử dụng `allowedStatus = ["open", "pending", "closed", "resolved"]`
- ✅ `getAllTicketsController.js`: Sử dụng `allowedStatus = ["open", "pending", "closed", "resolved"]`
- ✅ `getSupportStatsController.js`: Trả về `pending_tickets` thay vì `in_progress_tickets`

### Frontend  
- ✅ `SupportDashboard.js`: Sử dụng `pending_tickets` từ API stats
- ✅ `SupportTicketManagement.js`: Gọi `handleStatusUpdate(ticketId, "pending")`
- ✅ `supportService.js`: `addResponse` set status = "pending"

## Lưu ý
- **KHÔNG CẦN** thay đổi database schema
- Status `pending` đã tồn tại và có nghĩa là "đang xử lý"
- Tất cả frontend components đều sử dụng đúng status values
