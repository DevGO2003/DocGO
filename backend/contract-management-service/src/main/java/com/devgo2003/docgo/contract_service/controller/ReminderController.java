package com.devgo2003.docgo.contract_service.controller;

import com.devgo2003.docgo.contract_service.entity.Reminder;
import com.devgo2003.docgo.contract_service.service.ReminderService;
import com.devgo2003.docgo.contract_service.dto.ReminderCreateRequest;
import com.devgo2003.docgo.contract_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/contract-management-service/reminders")
@Tag(name = "API Quản lý Nhắc nhở", description = "Các API để quản lý nhắc nhở trong hệ thống DocGO")
public class ReminderController {

    private final ReminderService reminderService;
    private final HttpServletRequest request;

    public ReminderController(ReminderService reminderService, HttpServletRequest request) {
        this.reminderService = reminderService;
        this.request = request;
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách nhắc nhở (hợp nhất)",
        description = "Hỗ trợ lọc qua query: contractId, status (PENDING|SENT|COMPLETED|CANCELLED|FAILED|ESCALATED), type, priority, scheduledFrom, scheduledTo, dueFrom, dueTo; aggregate=count|exists. Phân trang/sắp xếp: pageNumber, pageSize, sortBy(createdAt|scheduledAt), sortDirection."
    )
    public ResponseEntity<RestResponse<?>> getAllReminders(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Reminder.ReminderStatus status,
            @RequestParam(required = false) Reminder.ReminderType type,
            @RequestParam(required = false) Reminder.ReminderPriority priority,
            @RequestParam(required = false) String scheduledFrom,
            @RequestParam(required = false) String scheduledTo,
            @RequestParam(required = false) String dueFrom,
            @RequestParam(required = false) String dueTo,
            @RequestParam(required = false) Integer minSentCount,
            @RequestParam(required = false) Integer minEscalationLevel,
            @RequestParam(required = false) String aggregate) {

        // Aggregate mode (count | exists)
        if (aggregate != null && !aggregate.isBlank()) {
            String agg = aggregate.toLowerCase();
            if ("count".equals(agg)) {
                long count;
                if (contractId != null && status != null) {
                    count = reminderService.countRemindersByContractIdAndStatus(contractId, status);
                } else if (contractId != null) {
                    count = reminderService.countRemindersByContractId(contractId);
                } else {
                    List<Reminder> all = reminderService.getAllReminders();
                    count = all == null ? 0 : all.size();
                }
                RestResponse<Long> response = RestResponse.<Long>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đếm số nhắc nhở thành công.")
                        .data(count)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            if ("exists".equals(agg)) {
                boolean exists = false;
                if (contractId != null && status != null) {
                    // No direct exists-by-status; degrade to count>0
                    exists = reminderService.countRemindersByContractIdAndStatus(contractId, status) > 0;
                } else if (contractId != null) {
                    exists = reminderService.existsRemindersByContractId(contractId);
                }
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Kiểm tra tồn tại nhắc nhở thành công.")
                        .data(exists)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }

        // List mode
        List<Reminder> reminders;
        if (contractId != null && status == Reminder.ReminderStatus.PENDING) {
            reminders = reminderService.getPendingRemindersByContractId(contractId);
        } else if (contractId != null && status == Reminder.ReminderStatus.SENT) {
            reminders = reminderService.getSentRemindersByContractId(contractId);
        } else if (contractId != null && status == Reminder.ReminderStatus.COMPLETED) {
            reminders = reminderService.getCompletedRemindersByContractId(contractId);
        } else if (contractId != null && status == Reminder.ReminderStatus.CANCELLED) {
            reminders = reminderService.getCancelledRemindersByContractId(contractId);
        } else if (contractId != null && status == Reminder.ReminderStatus.FAILED) {
            reminders = reminderService.getFailedRemindersByContractId(contractId);
        } else if (contractId != null && status == Reminder.ReminderStatus.ESCALATED) {
            reminders = reminderService.getEscalatedRemindersByContractId(contractId);
        } else if (contractId != null && type != null) {
            reminders = reminderService.getRemindersByReminderType(contractId, type);
        } else if (contractId != null && priority != null) {
            reminders = reminderService.getRemindersByPriority(contractId, priority);
        } else if (contractId != null && sortBy != null && sortBy.equalsIgnoreCase("scheduledAt")) {
            reminders = reminderService.getRemindersByContractIdOrderByScheduledAt(contractId);
        } else if (contractId != null && sortBy != null && sortBy.equalsIgnoreCase("createdAt")) {
            reminders = reminderService.getRemindersByContractIdOrderByCreatedAt(contractId);
        } else if (scheduledFrom != null && scheduledTo != null) {
            try {
                LocalDateTime from = LocalDateTime.parse(scheduledFrom);
                LocalDateTime to = LocalDateTime.parse(scheduledTo);
                reminders = reminderService.getRemindersByScheduledAtBetween(from, to);
            } catch (Exception e) {
                reminders = reminderService.getAllReminders();
            }
        } else if (dueFrom != null && dueTo != null) {
            try {
                LocalDateTime from = LocalDateTime.parse(dueFrom);
                LocalDateTime to = LocalDateTime.parse(dueTo);
                reminders = reminderService.getRemindersByDueDateBetween(from, to);
            } catch (Exception e) {
                reminders = reminderService.getAllReminders();
            }
        } else if (minSentCount != null) {
            reminders = reminderService.getRemindersWithHighSentCount(minSentCount);
        } else if (minEscalationLevel != null) {
            reminders = reminderService.getRemindersWithHighEscalationLevel(minEscalationLevel);
        } else if (contractId != null) {
            reminders = reminderService.getRemindersByContractId(contractId);
        } else {
            reminders = reminderService.getAllReminders();
        }

        if (reminders == null || reminders.isEmpty()) {
            RestResponse<List<Reminder>> response = RestResponse.<List<Reminder>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có nhắc nhở nào.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        RestResponse<List<Reminder>> response = RestResponse.<List<Reminder>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách nhắc nhở thành công.")
            .data(reminders)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy chi tiết nhắc nhở", 
        description = """
        🔹 Đầu vào
        
        🔗 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của nhắc nhở cần lấy
        
        🔹 Đầu ra
        
        📝 data
        Loại: Reminder
        Mô tả: Thông tin chi tiết nhắc nhở
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK, 404: Not Found)
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý
        
        ⏰ timestamp
        Loại: string
        Mô tả: Thời điểm xử lý request (ISO-8601)
        
        🔗 requestId
        Loại: string
        Mô tả: ID duy nhất của request
        
        📍 path
        Loại: string
        Mô tả: Đường dẫn API được gọi
        """
    )
    public ResponseEntity<RestResponse<Reminder>> getReminder(@PathVariable String id) {
        Optional<Reminder> reminder = reminderService.getReminderById(id);
        
        if (reminder.isEmpty()) {
            RestResponse<Reminder> response = RestResponse.<Reminder>builder()
                .apiVersion("v1")
                .statusCode(404)
                .shortMessage("Not Found")
                .description("Không tìm thấy nhắc nhở với ID: " + id)
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy chi tiết nhắc nhở thành công.")
            .data(reminder.get())
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(
        summary = "Tạo nhắc nhở mới", 
        description = """
        🔹 Đầu vào
        
        📄 reminder (bắt buộc, body)
        Loại: ReminderCreateRequest
        Mô tả: Thông tin nhắc nhở cần tạo (contractId, title, description, reminderType, reminderDate, isRecurring, recurringPattern)
        
        🔹 Đầu ra
        
        📝 data
        Loại: Reminder
        Mô tả: Thông tin nhắc nhở đã được tạo thành công
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (201: Created)
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý
        
        ⏰ timestamp
        Loại: string
        Mô tả: Thời điểm xử lý request (ISO-8601)
        
        🔗 requestId
        Loại: string
        Mô tả: ID duy nhất của request
        
        📍 path
        Loại: string
        Mô tả: Đường dẫn API được gọi
        """
    )
    public ResponseEntity<RestResponse<Reminder>> createReminder(@RequestBody ReminderCreateRequest request) {
        Reminder reminder = reminderService.createReminder(request);
        
        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(201)
            .shortMessage("Created")
            .description("Tạo nhắc nhở thành công.")
            .data(reminder)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(this.request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Deprecated nested create endpoint removed. Use POST /reminders with body instead.

    // Deprecated nested list endpoint removed. Use GET /reminders?contractId=...

    // Duplicate method removed: getReminderById - already exists as getReminder above

    // Deprecated nested pending endpoint removed. Use GET /reminders?contractId=...&status=PENDING

    // Deprecated nested completed endpoint removed. Use GET /reminders?contractId=...&status=COMPLETED

    // Deprecated nested escalated endpoint removed. Use GET /reminders?contractId=...&status=ESCALATED

    @GetMapping("/due")
    @Operation(summary = "Lấy reminder đến hạn", description = "Lấy danh sách reminder đến hạn")
    public ResponseEntity<RestResponse<List<Reminder>>> getDueReminders(@RequestParam LocalDateTime currentTime) {
        List<Reminder> reminders = reminderService.getDueReminders(currentTime);
        
        if (reminders.isEmpty()) {
            RestResponse<List<Reminder>> response = RestResponse.<List<Reminder>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có reminder nào đến hạn.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<List<Reminder>> response = RestResponse.<List<Reminder>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách reminder đến hạn thành công.")
            .data(reminders)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/overdue")
    @Operation(summary = "Lấy reminder quá hạn", description = "Lấy danh sách reminder quá hạn")
    public ResponseEntity<RestResponse<List<Reminder>>> getOverdueReminders(@RequestParam LocalDateTime currentTime) {
        List<Reminder> reminders = reminderService.getOverdueReminders(currentTime);
        
        if (reminders.isEmpty()) {
            RestResponse<List<Reminder>> response = RestResponse.<List<Reminder>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có reminder nào quá hạn.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<List<Reminder>> response = RestResponse.<List<Reminder>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách reminder quá hạn thành công.")
            .data(reminders)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/send")
    @Operation(summary = "Gửi reminder", description = "Gửi reminder")
    public ResponseEntity<RestResponse<Reminder>> sendReminder(@PathVariable String id) {
        Reminder reminder = reminderService.sendReminder(id);
        
        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Gửi reminder thành công.")
            .data(reminder)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Hoàn thành reminder", description = "Đánh dấu reminder hoàn thành")
    public ResponseEntity<RestResponse<Reminder>> completeReminder(
            @PathVariable String id,
            @RequestParam String completedBy,
            @RequestParam String completionNotes) {
        Reminder reminder = reminderService.completeReminder(id, completedBy, completionNotes);
        
        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Hoàn thành reminder thành công.")
            .data(reminder)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Hủy reminder", description = "Hủy reminder")
    public ResponseEntity<RestResponse<Reminder>> cancelReminder(
            @PathVariable String id,
            @RequestParam String cancelledBy,
            @RequestParam String cancellationReason) {
        Reminder reminder = reminderService.cancelReminder(id, cancelledBy, cancellationReason);
        
        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Hủy reminder thành công.")
            .data(reminder)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/escalate")
    @Operation(summary = "Escalate reminder", description = "Escalate reminder")
    public ResponseEntity<RestResponse<Reminder>> escalateReminder(
            @PathVariable String id,
            @RequestParam String escalatedTo) {
        Reminder reminder = reminderService.escalateReminder(id, escalatedTo);
        
        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Escalate reminder thành công.")
            .data(reminder)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa reminder", description = "Soft delete reminder")
    public ResponseEntity<RestResponse<Void>> deleteReminder(
            @PathVariable String id,
            @RequestParam String deletedBy) {
        reminderService.deleteReminder(id, deletedBy);
        
        RestResponse<Void> response = RestResponse.<Void>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Xóa reminder thành công.")
            .data(null)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Khôi phục reminder", description = "Khôi phục reminder đã xóa")
    public ResponseEntity<RestResponse<Reminder>> restoreReminder(@PathVariable String id) {
        Reminder reminder = reminderService.restoreReminder(id);
        
        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Khôi phục reminder thành công.")
            .data(reminder)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật từng phần reminder (rút gọn)", description = "Hỗ trợ: send, complete, cancel, escalate")
    public ResponseEntity<RestResponse<Reminder>> patchReminder(
            @PathVariable String id,
            @RequestBody java.util.Map<String, Object> body) {
        Reminder updated = null;

        if (Boolean.TRUE.equals(body.get("send"))) {
            updated = reminderService.sendReminder(id);
        }
        if (Boolean.TRUE.equals(body.get("complete"))) {
            String completedBy = (String) body.getOrDefault("completedBy", "");
            String completionNotes = (String) body.getOrDefault("completionNotes", "");
            updated = reminderService.completeReminder(id, completedBy, completionNotes);
        }
        if (Boolean.TRUE.equals(body.get("cancel"))) {
            String cancelledBy = (String) body.getOrDefault("cancelledBy", "");
            String cancellationReason = (String) body.getOrDefault("cancellationReason", "");
            updated = reminderService.cancelReminder(id, cancelledBy, cancellationReason);
        }
        if (body.containsKey("escalatedTo")) {
            Object v = body.get("escalatedTo");
            if (v instanceof String s) {
                updated = reminderService.escalateReminder(id, s);
            }
        }

        if (updated == null) {
            RestResponse<Reminder> bad = RestResponse.<Reminder>builder()
                .apiVersion("v1")
                .statusCode(400)
                .shortMessage("Bad Request")
                .description("Không có trường hợp lệ để cập nhật.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(bad, HttpStatus.OK);
        }

        RestResponse<Reminder> response = RestResponse.<Reminder>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật reminder thành công.")
            .data(updated)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/count")
    @Operation(summary = "Đếm reminder (rút gọn)", description = "Thay thế các đường dẫn count-* bằng query aggregate=count")
    public ResponseEntity<RestResponse<Long>> countReminders(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Reminder.ReminderStatus status) {
        long count;
        if (contractId != null && status != null) {
            count = reminderService.countRemindersByContractIdAndStatus(contractId, status);
        } else if (contractId != null) {
            count = reminderService.countRemindersByContractId(contractId);
        } else {
            List<Reminder> all = reminderService.getAllReminders();
            count = all == null ? 0 : all.size();
        }
        RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số reminder thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/exists")
    @Operation(summary = "Kiểm tra tồn tại reminder (rút gọn)", description = "Thay thế các đường dẫn exists-* bằng query aggregate=exists")
    public ResponseEntity<RestResponse<Boolean>> existsReminders(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Reminder.ReminderStatus status) {
        boolean exists = false;
        if (contractId != null && status != null) {
            exists = reminderService.countRemindersByContractIdAndStatus(contractId, status) > 0;
        } else if (contractId != null) {
            exists = reminderService.existsRemindersByContractId(contractId);
        }
        RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra tồn tại reminder thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}




