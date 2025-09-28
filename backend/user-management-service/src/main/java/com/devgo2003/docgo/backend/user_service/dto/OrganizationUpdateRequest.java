package com.devgo2003.docgo.backend.user_service.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrganizationUpdateRequest {

    @Size(min = 2, max = 100, message = "Tên tổ chức phải có từ 2 đến 100 ký tự")
    private String name;

    @Size(min = 2, max = 20, message = "Mã tổ chức phải có từ 2 đến 20 ký tự")
    private String code;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    @Size(max = 500, message = "Địa chỉ không được vượt quá 500 ký tự")
    private String address;

    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    private String phone;

    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;

    @Size(max = 200, message = "Website không được vượt quá 200 ký tự")
    private String website;
}
