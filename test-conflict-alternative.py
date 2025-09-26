#!/usr/bin/env python3
"""
Test file để tạo conflict - phiên bản thay thế
"""

def hello_world():
    """Hàm chào thế giới"""
    print("Xin chào thế giới!")
    return "Xin chào thế giới!"

def calculate_sum(a, b):
    """Tính tổng hai số"""
    # Không có validation
    return a + b

def calculate_difference(a, b):
    """Tính hiệu hai số"""
    return a - b

def main():
    """Hàm chính"""
    hello_world()
    result = calculate_sum(5, 3)
    print(f"Kết quả: {result}")
    
    # Test thêm hàm mới
    difference = calculate_difference(10, 4)
    print(f"Hiệu: {difference}")

if __name__ == "__main__":
    main()
