import { Suspense } from "react";
import { ResetPasswordClient } from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordClient />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold">Loading reset form…</h1>
      <p className="mt-2 text-gray-600">Please wait…</p>
    </div>
  );
}
