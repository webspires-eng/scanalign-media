import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-900">
      <Image
        src="/Media/F.jpeg"
        alt="Company Logo"
        width={600} // proportional width
        height={168} // calculated height
        priority
      />
    </div>
  );
}
