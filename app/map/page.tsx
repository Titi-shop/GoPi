"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default function MapPage() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  // 🧠 Thay bằng API Key của bạn
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "YOUR_API_KEY_HERE",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Lỗi lấy vị trí:", err);
          alert("Không thể lấy vị trí hiện tại.");
        },
        {
          enableHighAccuracy: true, // 🔥 giúp định vị chính xác nhất
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ GPS!");
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {isLoaded && position ? (
        <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={16}>
          <Marker position={position} />
        </GoogleMap>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Đang tải bản đồ hoặc lấy vị trí...</p>
      )}
    </div>
  );
}
