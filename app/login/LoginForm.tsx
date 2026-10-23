"use client";
import { useActionState, useState } from "react";
import { signIn } from "@/app/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="login-form">
      <label className="field">
        <span>Email or username</span>
        <input name="login" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
      </label>
      <label className="field">
        <span>Password</span>
        <div className="pw">
          <input name="password" type={show ? "text" : "password"} autoComplete="current-password" required />
          <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? "🙈" : "👀"}
          </button>
        </div>
      </label>
      {state?.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn btn-primary btn-wide" disabled={pending} data-pop="chime">
        {pending ? "Checking the guest list…" : "Let me in ✨"}
      </button>
    </form>
  );
}
