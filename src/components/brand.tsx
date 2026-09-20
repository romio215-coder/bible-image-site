import Link from "next/link";
import { BookOpen } from "lucide-react";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="말씀빛 Bible 홈">
      <span className="brand-mark">
        <BookOpen size={23} strokeWidth={1.5} />
      </span>
      <span>
        말씀빛 <small>Bible</small>
      </span>
    </Link>
  );
}
