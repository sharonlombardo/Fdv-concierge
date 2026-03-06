export default function MyEdits() {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 70,
        paddingBottom: 80,
        background: "#faf9f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "70px 24px 80px",
      }}
    >
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(44, 36, 22, 0.4)",
          marginBottom: 16,
        }}
      >
        Taste Genome
      </p>
      <h1
        style={{
          fontFamily: "Lora, serif",
          fontSize: 32,
          fontWeight: 500,
          color: "#2c2416",
          marginBottom: 12,
        }}
      >
        My Edits
      </h1>
      <p
        style={{
          fontFamily: "Lora, serif",
          fontSize: 15,
          fontStyle: "italic",
          color: "rgba(44, 36, 22, 0.55)",
          maxWidth: 360,
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        AI-curated capsules generated from your saves. Based on everything you are, here's what we think you'll love.
      </p>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#c9a84c",
          }}
        />
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(44, 36, 22, 0.5)",
          }}
        >
          Coming Soon
        </span>
      </div>
    </div>
  );
}
