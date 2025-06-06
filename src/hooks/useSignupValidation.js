import { useState } from "react";

// サインアップフォーム用のバリデーションロジックを管理するカスタムフック
export function useSignupValidation() {
  // 入力値の状態管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 各入力項目のエラーメッセージを管理
  const [errors, setErrors] = useState({});

  // 共通バリデーションロジック（単項目または全体チェックに使用）
  const validateField = (fieldName, value = null) => {
    const newErrors = { ...errors };

    const fieldValue = {
      email,
      password,
      passwordConfirm,
      ...(value && { [fieldName]: value }),
    };

    switch (fieldName) {
      case "email":
        if (
          !fieldValue.email.includes("@") ||
          !fieldValue.email.includes(".")
        ) {
          newErrors.email = "有効なメールアドレスを入力してください";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (fieldValue.password.length < 6) {
          newErrors.password = "パスワードは6文字以上で入力してください";
        } else {
          delete newErrors.password;
        }
        break;

      case "passwordConfirm":
        if (fieldValue.password !== fieldValue.passwordConfirm) {
          newErrors.passwordConfirm = "パスワードが一致しません";
        } else {
          delete newErrors.passwordConfirm;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // 全体バリデーション（送信時）
  const validate = () => {
    validateField("email");
    validateField("password");
    validateField("passwordConfirm");

    // // 非同期のため、最新の状態を直接使ってチェックする
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

  // 外部に返す値と関数
  return {
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    validate,
    validateField,
  };
}
