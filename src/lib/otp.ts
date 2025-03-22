export const sendOtpToEmail = async (
  email: string,
  role: "admin" | "professor",
  userId: string
) => {
  try {
    console.log(email, role, userId);
    const res = await fetch(`/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, userId }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send OTP");

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const verifyOtp = async (
  userId: string,
  otp: string
): Promise<boolean> => {
  try {
    const res = await fetch(`/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, otp }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) return false;

    return true;
  } catch (error) {
    return false;
  }
};
