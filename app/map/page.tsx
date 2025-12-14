"use client";

import { useEffect, useState } from "react";

type Position = {
  lat: number;
  lng: number;
};

export default function MapPage() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Bảo vệ tuyệt đối cho môi trường không hỗ trợ
    if (typeof window === "undefined") return;

    if (!("geolocation" in navigator)) {
      setError("Trình duyệt không hỗ trợ định vị GPS");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
       if (process.env.NODE_ENV === "development") {
  console.log("ℹ️ GPS unavailable (expected on desktop)");
}

        // WebView / Pi Browser thường trả {}
        if (!err || Object.keys(err).length === 0) {
          setError(
            "Không thể lấy vị trí.\n" +
              "• Thiết bị không có GPS\n" +
              "• Hoặc Pi Browser / WebView bị giới hạn\n" +
              "• Vui lòng chọn vị trí thủ công"
          );
        } else {
          switch (err.code) {
            case 1:
              setError("Bạn đã từ chối quyền truy cập vị trí");
              break;
            case 2:
              setError("Không xác định được vị trí hiện tại");
              break;
            case 3:
              setError("Lấy vị trí quá thời gian");
              break;
            default:
              setError("Lỗi GPS không xác định");
          }
        }

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // ===== UI =====

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>
        📍 Bản đồ tài xế
      </h1>

      {loading && <p>⏳ Đang lấy vị trí hiện tại...</p>}

      {!loading && error && (
        <div style={{ color: "red", whiteSpace: "pre-line" }}>
          ❌ {error}
        </div>
      )}

      {!loading && position && (
        <div style={{ marginTop: 12 }}>
          <p>✅ Vị trí hiện tại:</p>
          <p>
            <strong>Lat:</strong> {position.lat}
            <br />
            <strong>Lng:</strong> {position.lng}
          </p>

          {/* Placeholder cho map thật */}
          <div
            style={{
              marginTop: 12,
              height: 200,
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
            }}
          >
            🗺️ Map sẽ hiển thị ở đây
          </div>
        </div>
      )}

      {/* Fallback thủ công */}
      {!loading && !position && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() =>
              setPosition({ lat: 10.762622, lng: 106.660172 })
            }
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              border: "none",
              background: "#000",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            📌 Dùng vị trí mặc định (test)
          </button>
        </div>
      )}
    </div>
  );
}

