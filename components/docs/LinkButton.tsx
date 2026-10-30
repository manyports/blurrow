"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type ButtonProps = React.ComponentProps<typeof Button>;

/* Button has no link mode, so navigation goes through the router */
export function LinkButton({ href, ...props }: ButtonProps & { href: string }) {
  const router = useRouter();
  return <Button {...props} onMouseEnter={() => router.prefetch(href)} onClick={() => router.push(href)} />;
}
