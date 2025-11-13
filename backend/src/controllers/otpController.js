const otpStore = new Map();

// ➕ Gửi OTP (giả lập)
export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);
  console.log(`📩 OTP gửi cho ${phone}: ${otp}`);
  res.json({ message: "OTP đã được gửi (xem console)!" });
};

// ✅ Xác thực OTP
export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (otpStore.get(phone) === otp) {
    otpStore.delete(phone);
    return res.json({ message: "Xác thực OTP thành công!" });
  }
  res.status(400).json({ message: "OTP không đúng hoặc đã hết hạn!" });
};
