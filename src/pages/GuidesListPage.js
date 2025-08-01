// src/pages/GuidesListPage.js

import React from "react";

// 1. Import dữ liệu giả và component Card
// Hãy chắc chắn rằng đường dẫn này là chính xác!
import { mockGuides } from "../data/mockData";
import GuideCard from "../components/guide/GuideCard";

// Import file CSS để trang có giao diện
import "./GuidesListPage.css";

const GuidesListPage = () => {
  // Lọc ra chỉ những HDV đã được xác minh để hiển thị
  const verifiedGuides = mockGuides.filter((guide) => guide.isVerified);

  // Thêm dòng console.log này để kiểm tra trong Dev Tools (F12)
  console.log("Dữ liệu HDV đã được lọc:", verifiedGuides);

  return (
    <div className="guides-list-page">
      <h1 className="page-title">Tìm Hướng Dẫn Viên Phù Hợp Với Bạn</h1>
      <p className="page-subtitle">
        Khám phá những trải nghiệm độc đáo cùng các hướng dẫn viên chuyên nghiệp
        đã được xác minh.
      </p>

      {/* 2. Dùng .map() để lặp qua mảng dữ liệu và render ra GuideCard */}
      <div className="guides-grid">
        {verifiedGuides.map((guide) => (
          // Mỗi phần tử trong danh sách cần một key duy nhất, ta sẽ dùng guide.id
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
};

export default GuidesListPage;
