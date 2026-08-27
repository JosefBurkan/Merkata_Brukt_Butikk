import Link from "next/link";

export default function BackToAdmin() {
  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
    >
      <span aria-hidden="true">←</span>
      Tilbake til adminpanel
    </Link>
  );
}