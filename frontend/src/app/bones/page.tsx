// src/app/bones/[id]/page.tsx
import { redirect } from "next/navigation";

export default function BoneIdRedirect({ params }: { params: { id: string } }) {
  const q = new URLSearchParams({ boneId: params.id });
  // We point to your existing folder: /skeleton-editor
  redirect(`/skeleton-editor?${q.toString()}`);
}
