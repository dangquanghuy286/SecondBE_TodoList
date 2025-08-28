// Xuất hàm generateRandomNumber để sử dụng ở nơi khác
module.exports.generateRandomNumber = (length) => {
  // Tập hợp các ký tự có thể dùng để tạo chuỗi ngẫu nhiên
  const characters = "0123456789";

  // Biến lưu trữ chuỗi kết quả
  let result = "";

  // Lặp qua số lần bằng với độ dài mong muốn
  for (let i = 0; i < length; i++) {
    // Math.random() tạo số ngẫu nhiên
    // Nhân với độ dài chuỗi characters để chọn vị trí ngẫu nhiên trong chuỗi
    // Math.floor làm tròn xuống để lấy chỉ số nguyên
    // charAt(...) lấy ký tự tại vị trí đó
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Trả về chuỗi kết quả ngẫu nhiên sau khi hoàn tất vòng lặp
  return result;
};
