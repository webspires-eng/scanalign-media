import Image from "next/image";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // centers horizontally
        alignItems: "center", // centers vertically
        height: "100vh", // full viewport height
      }}
    >
      <Image
        src="/media/F.jpeg"
        alt="Company Logo"
        width={600} // proportional width
        height={168} // calculated height
        priority
      />
    </div>
  );
}
