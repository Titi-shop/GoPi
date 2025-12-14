"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type Position = { lat: number; lng: number };

export default function MapPage() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  useEffect(() => {
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
      () => {
        setError(
          "Không thể lấy vị trí.\n• Thiết bị không có GPS\n• Hoặc Pi Browser/WebView bị giới hạn\n• Hãy bấm dùng vị trí mặc định (test)"
        );
        setLoading(false);
      }
    );
  }, []);

  const useDefault = () => {
    setPosition({ lat: 10.762622, lng: 106.660172 });
    setError(null);
    setLoading(false);
  };

  return (
    <div style={{ padding: 16, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>📍 Bản đồ tài xế</h1>

      {loading && <p>⏳ Đang lấy vị trí...</p>}

      {!loading && error && (
        <div style={{ color: "red", whiteSpace: "pre-line" }}>
          ❌ {error}
        </div>
      )}

      {!position && !loading && (
        <button
          onClick={useDefault}
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          📌 Dùng vị trí mặc định (test)
        </button>
      )}

      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
        <p style={{ color: "red", marginTop: 12 }}>
          ❌ Thiếu Google Maps API Key
        </p>
      ) : !isLoaded ? (
        <p>⏳ Đang tải Google Map...</p>
      ) : position ? (
        <div
          style={{
            width: "100%",
            height: 320,
            marginTop: 12,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={position}
            zoom={16}
          >
            <Marker position={position} />
          </GoogleMap>
        </div>
      ) : null}
    </div>
  );
}
