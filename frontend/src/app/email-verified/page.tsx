import { Suspense } from "react";
import EmailVerifiedClient from "./EmailVerifiedClient";

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={<EmailVerifiedLoading />}>
      <EmailVerifiedClient />
    </Suspense>
  );
}

function EmailVerifiedLoading() {
  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold">Loading reset form…</h1>
      <p className="mt-2 text-gray-600">Please wait…</p>
    </div>
  );
}
