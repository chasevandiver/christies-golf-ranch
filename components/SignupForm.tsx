"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signup, type SignupResult } from "@/app/actions/signup";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-brass btn-lg" type="submit" disabled={pending}>
      {pending ? "Sending…" : label}
    </button>
  );
}

export default function SignupForm({ buttonLabel }: { buttonLabel: string }) {
  const [state, formAction] = useFormState<SignupResult | null, FormData>(signup, null);

  if (state?.ok) {
    return <p className="signup-msg">{state.message}</p>;
  }

  return (
    <form className="signup-form-wrap" action={formAction}>
      <div className="signup-form">
        <input type="text" name="name" placeholder="Your name (optional)" autoComplete="name" />
        <input type="email" name="email" placeholder="Your email" autoComplete="email" required />
        <SubmitButton label={buttonLabel} />
      </div>
      <label className="signup-consent">
        <input type="checkbox" name="consent" />
        <span>Yes, it&apos;s okay to email me tips and updates from Christie&apos;s Golf Ranch. I can unsubscribe anytime.</span>
      </label>
      {state && !state.ok ? <p className="signup-msg">{state.message}</p> : null}
    </form>
  );
}
