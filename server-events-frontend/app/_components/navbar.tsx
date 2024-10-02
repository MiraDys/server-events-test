import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-600 text-white">
      <ul className="flex flex-wrap gap-16 items-center justify-end p-4 mr-16 text-xl">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/sse-streaming">SSE Streaming</Link>
        </li>
        <li>
          <Link href="/websocket">Websocket</Link>
        </li>
      </ul>
    </nav>
  );
}
