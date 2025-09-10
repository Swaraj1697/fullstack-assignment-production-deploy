export default function MainLayout({ children }) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",  // keep content at top
          minHeight: "100vh",
          width: "100vw",
          background: "#f9f9f9",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",   // ✅ allow wide content
            margin: "0 auto",     // center horizontally
          }}
        >
          {children}
        </div>
      </div>
    );
  }
  