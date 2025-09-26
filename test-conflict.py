#!/usr/bin/env python3
"""
Test file để tạo conflict
"""

def hello_world():
    """Hàm chào thế giới"""
    print("Hello World!")
    return "Hello World!"

def calculate_sum(a, b):
    """Tính tổng hai số"""
    # Thêm validation
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise ValueError("Các tham số phải là số")
    return a + b

def calculate_product(a, b):
    """Tính tích hai số"""
    return a * b

def main():
    """Hàm chính"""
    hello_world()
    result = calculate_sum(5, 3)
    print(f"Kết quả: {result}")
    
    # Test thêm hàm mới
    product = calculate_product(4, 6)
    print(f"Tích: {product}")

if __name__ == "__main__":
    main()
