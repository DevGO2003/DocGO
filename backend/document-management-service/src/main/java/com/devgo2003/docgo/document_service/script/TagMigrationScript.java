package com.devgo2003.docgo.document_service.script;

import com.devgo2003.docgo.document_service.entity.Tag;
import com.devgo2003.docgo.document_service.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class TagMigrationScript implements CommandLineRunner {
    
    @Autowired
    private TagRepository tagRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Chỉ chạy migration nếu có tham số --migrate-tags
        if (args.length > 0 && args[0].equals("--migrate-tags")) {
            System.out.println("Bắt đầu migration tags...");
            migrateTags();
            System.out.println("Migration tags hoàn thành!");
        }
    }
    
    private void migrateTags() {
        // Tạo danh sách tags test
        List<String> testTags = Arrays.asList(
            "ưu_tiên_cao",
            "hợp_đồng_dài_hạn",
            "thanh_toán_định_kỳ",
            "bảo_hiểm",
            "giai_đoạn_thử_việc",
            "tăng_lương",
            "nghỉ_phép",
            "đào_tạo",
            "công_tác",
            "thưởng",
            "kỷ_luật",
            "chấm_dứt_hợp_đồng",
            "bảo_mật",
            "bí_mật_thương_mại",
            "cạnh_tranh",
            "sở_hữu_trí_tuệ",
            "giải_quyết_tranh_chấp",
            "luật_áp_dụng",
            "điều_khoản_đặc_biệt",
            "phụ_lục"
        );
        
        // Xóa tất cả tags cũ (nếu có)
        tagRepository.deleteAll();
        
        // Tạo tags mới với dữ liệu test
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < testTags.size(); i++) {
            String tagName = testTags.get(i);
            LocalDateTime createdAt = now.minusDays(i * 2); // Tạo tags trong 40 ngày qua
            LocalDateTime lastUsedAt = now.minusDays(i); // Sử dụng gần đây hơn
            
            Tag tag = Tag.builder()
                    .name(tagName)
                    .displayName(formatTagDisplayName(tagName))
                    .count((long) (Math.random() * 50) + 1) // Số lần sử dụng ngẫu nhiên 1-50
                    .isPopular(i < 5) // 5 tags đầu là popular
                    .createdAt(createdAt)
                    .updatedAt(now)
                    .lastUsedAt(lastUsedAt)
                    .isDeleted(false)
                    .build();
            
            tagRepository.save(tag);
            System.out.println("Đã tạo tag: " + tagName);
        }
        
        // Cập nhật top5 lists cho tất cả tags
        updateTop5Lists();
    }
    
    private void updateTop5Lists() {
        // Lấy top 5 last used tags
        List<Tag> top5LastUsed = tagRepository.findTop5ByIsDeletedFalseOrderByLastUsedAtDesc();
        List<String> top5LastUsedNames = top5LastUsed.stream()
                .map(Tag::getName)
                .toList();
        
        // Lấy top 5 last created tags
        List<Tag> top5LastCreated = tagRepository.findTop5ByIsDeletedFalseOrderByCreatedAtDesc();
        List<String> top5LastCreatedNames = top5LastCreated.stream()
                .map(Tag::getName)
                .toList();
        
        // Cập nhật tất cả tags với top5 lists
        List<Tag> allTags = tagRepository.findByIsDeletedFalse();
        for (Tag tag : allTags) {
            tag.setTop5LastUsed(top5LastUsedNames);
            tag.setTop5LastCreated(top5LastCreatedNames);
            tag.setUpdatedAt(LocalDateTime.now());
        }
        
        tagRepository.saveAll(allTags);
        System.out.println("Đã cập nhật top5 lists cho tất cả tags");
    }
    
    private String formatTagDisplayName(String tagName) {
        if (tagName == null || tagName.trim().isEmpty()) {
            return tagName;
        }
        
        // Bỏ dấu gạch dưới và thay bằng khoảng trắng
        String formatted = tagName.replace("_", " ");
        
        // Viết hoa chữ cái đầu của mỗi từ
        String[] words = formatted.split("\\s+");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) {
                result.append(" ");
            }
            if (!words[i].isEmpty()) {
                result.append(Character.toUpperCase(words[i].charAt(0)))
                      .append(words[i].substring(1).toLowerCase());
            }
        }
        
        return result.toString();
    }
}
