"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Key, ArrowLeft } from "lucide-react";

interface OTPFormProps {
  email: string;
  role: string;
}

export default function OTPForm({ email, role }: OTPFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);

  // Mask email for display
  const maskedEmail = email.replace(/(?<=.{1}).*(?=@)/, "********");

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  // Watch for complete OTP
  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 6 && !isLoading && !hasSubmitted.current) {
      hasSubmitted.current = true;
      formRef.current?.requestSubmit();
    }
  }, [otp, isLoading]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return; // Prevent multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Allow only numbers, backspace, and arrow keys
    if (
      !/^\d$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        otp: otpString,
        role,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid or expired OTP");
        // Reset form for another attempt
        setOtp(["", "", "", "", "", ""]);
        hasSubmitted.current = false;
        inputRefs.current[0]?.focus();
        return;
      }

      router.push(`/${role}`);
      router.refresh();
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Failed to verify OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      hasSubmitted.current = false;
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.form
      ref={formRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <p className="text-gray-300 text-sm">
          Enter the verification code sent to
        </p>
        <p className="text-white font-medium">{maskedEmail}</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-sm text-red-400 bg-red-950/50 rounded-lg border border-red-900"
        >
          {error}
        </motion.div>
      )}

      <div className="flex justify-center gap-2 text-gray-300">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-xl font-semibold bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
            whileFocus={{ scale: 1.05 }}
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Verifying...
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              Verify OTP
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1"
          whileHover={{ x: -2 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </motion.button>
      </div>
    </motion.form>
  );
}
