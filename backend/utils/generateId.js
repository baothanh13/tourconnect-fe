// utils/generateId.js
function generateId(type) {
  const prefixMap = {
    user: "U",
    guide: "G",
    booking: "B",
    payment: "P",
    ticket: "ST",
    tour: "T",
  };

  // Lấy prefix theo type
  const prefix = prefixMap[type.toLowerCase()] || "GEN";

  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(2, 10); // yyMMddHH

  const random = Math.floor(100 + Math.random() * 900); // 3 digits


  return `${prefix}${timestamp}${random}`;
}

module.exports = generateId;
