import { ImageResponse } from "next/og";

export const alt = "HS Choice 밸런스 게임 커뮤니티";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #f3f0ea 0%, #e8d5d0 100%)",
          color: "#141210",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#c45c6a",
          }}
        >
          BALANCE GAME
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          HS Choice
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#5c564e" }}>
          Vote, create, and compare two choices.
        </div>
      </div>
    ),
    size,
  );
}
