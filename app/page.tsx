import Image from "next/image";
import ReklamationForm from "@/components/ReklamationForm";
import logo from "@/public/awimex-logo.png";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          padding: "18px 40px",
          flexShrink: 0,
        }}
      >
        <Image
          src={logo}
          alt="Awimex"
          style={{ height: 36, width: "auto", display: "block" }}
          priority
        />
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "52px 24px 80px",
          background: "#ececec",
        }}
      >
        <ReklamationForm />
      </main>
    </div>
  );
}
