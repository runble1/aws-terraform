import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import { useRouter } from 'next/router';

type FormData = {
  username: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loginError, setLoginError] = useState<string>('');
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async data => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result && !result.error) {
      // 認証が成功した場合の処理（例: ホームページへリダイレクト）
      router.push('/');
    } else {
      // 認証が失敗した場合の処理（例: エラーメッセージを表示）
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 入力フィールド */}
      {/* ... */}
      
      {loginError && <p>{loginError}</p>}

      <button type="submit">Log In</button>
    </form>
  );
}
