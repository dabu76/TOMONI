import { useState } from "react";

// サインアップフォーム用のバリデーションロジックを管理するカスタムフック
export function useSignupValidation() {
  // 入力値の状態管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 各入力項目のエラーメッセージを管理
  const [errors, setErrors] = useState({});

  // フィールドごとのバリデーション（onBlur時に使用）
  const validateField = (field) => {
    const newErrors = { ...errors };

    if (field === "email") {
      if (!email.includes("@") || !email.includes(".")) {
        newErrors.email = "有効なメールアドレスを入力してください";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      if (password.length < 6) {
        newErrors.password = "パスワードは6文字以上で入力してください";
      } else {
        delete newErrors.password;
      }
    }

    if (field === "passwordConfirm") {
      if (password !== passwordConfirm) {
        newErrors.passwordConfirm = "パスワードが一致しません";
      } else {
        delete newErrors.passwordConfirm;
      }
    }

    setErrors(newErrors);
  };

  // フォーム全体のバリデーション（送信時に使用）
  const validate = () => {
    const newErrors = {};

    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください";
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "パスワードが一致しません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 外部から使うための値と関数を返す
  return {
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    validate,
    validateField, // 単項目バリデーション用
  };
}
