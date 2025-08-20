const express = require("express");
const router = express.Router();

/**
 * Helper: nhận module (có thể export default là function, hoặc export named)
 * và trả về đúng handler là function, nếu không có thì trả undefined.
 */
function pickHandler(mod, name) {
  if (typeof mod === "function") return mod;
  if (mod && typeof mod[name] === "function") return mod[name];
  return undefined;
}

/**
 * @swagger
 * tags:
 *   - name: Guides
 *     description: APIs quản lý hướng dẫn viên (guides)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Guide:
 *       type: object
 *       properties:
 *         id: { type: string, example: guide_123abc }
 *         user_id: { type: string, example: user_456xyz }
 *         location: { type: string, example: Hanoi }
 *         languages:
 *           type: array
 *           items: { type: string }
 *           example: ["English", "Vietnamese"]
 *         specialties:
 *           type: array
 *           items: { type: string }
 *           example: ["History", "Food tours"]
 *         price_per_hour: { type: number, example: 20 }
 *         experience_years: { type: integer, example: 5 }
 *         description: { type: string, example: "Experienced tour guide..." }
 *         certificates:
 *           type: array
 *           items: { type: string }
 *           example: ["Tourism Certificate A", "Language Certificate B"]
 *     GuideInput:
 *       type: object
 *       properties:
 *         location: { type: string, example: Hanoi }
 *         languages:
 *           type: array
 *           items: { type: string }
 *           example: ["English", "Vietnamese"]
 *         specialties:
 *           type: array
 *           items: { type: string }
 *           example: ["History", "Food tours"]
 *         price_per_hour: { type: number, example: 20 }
 *         experience_years: { type: integer, example: 5 }
 *         description: { type: string, example: "Experienced tour guide..." }
 *         certificates:
 *           type: array
 *           items: { type: string }
 *           example: ["Tourism Certificate A", "Language Certificate B"]
 */

// ===== Import middleware & controllers an toàn (hỗ trợ default hoặc named export) =====
const verifyTokenMod = require("../middleware/verifyToken");
const verifyToken = pickHandler(verifyTokenMod, "verifyToken");

const getGuidesMod = require("../api/guides/getGuides.Controller");
const getGuides = pickHandler(getGuidesMod, "getGuides");

const getGuideByIdMod = require("../api/guides/getGuideById.Controller");
const getGuideById = pickHandler(getGuideByIdMod, "getGuideById");

const createGuideMod = require("../api/guides/createGuide.Controller");
const createGuide = pickHandler(createGuideMod, "createGuide");

const updateGuideMod = require("../api/guides/updateGuide.Controller");
const updateGuide = pickHandler(updateGuideMod, "updateGuide");

const createGuideProfileMod = require("../api/guides/createGuideProfile.Controller");
const createGuideProfile = pickHandler(createGuideProfileMod, "createGuideProfile");

const getGuideByUserIdMod = require("../api/guides/getGuideByUserId");
const getGuideByUserId = pickHandler(getGuideByUserIdMod, "getGuideByUserId");

// ===== Assert sớm: nếu thiếu function, throw lỗi đọc được =====
function assertFn(fn, name, path) {
  if (typeof fn !== "function") {
    const how = (m) =>
      (typeof m === "function")
        ? "module.exports = function ..."
        : (m && typeof m === "object")
          ? "module.exports = { " + name + " }"
          : "module.exports = ?";
    throw new Error(
      `[Routes] "${name}" is not a function. Kiểm tra export tại ${path}.
- Nếu file dùng: module.exports = ${name};  => import: const ${name} = require("${path}");
- Nếu file dùng: module.exports = { ${name} }; hoặc exports.${name} = ...  => import: const { ${name} } = require("${path}");
Hiện tại module dạng: ${how(require(path))}`
    );
  }
}

assertFn(getGuides, "getGuides", "../api/guides/getGuides.Controller");
assertFn(getGuideById, "getGuideById", "../api/guides/getGuideById.Controller");
assertFn(createGuide, "createGuide", "../api/guides/createGuide.Controller");
assertFn(updateGuide, "updateGuide", "../api/guides/updateGuide.Controller");
assertFn(createGuideProfile, "createGuideProfile", "../api/guides/createGuideProfile.Controller");
assertFn(getGuideByUserId, "getGuideByUserId", "../api/guides/getGuideByUserId");
assertFn(verifyToken, "verifyToken", "../middleware/verifyToken");

// ===== Routes =====

/**
 * @swagger
 * /api/guides:
 *   get:
 *     summary: Get list of guides with filter query
 *     tags: [Guides]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: language
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *       - in: query
 *         name: priceRange
 *         schema: { type: string }
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of guides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Guide'
 */
router.get("/", getGuides);

/**
 * @swagger
 * /api/guides/{id}:
 *   get:
 *     summary: Get guide by ID
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Guide found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 */
router.get("/:id", getGuideById);

/**
 * @swagger
 * /api/guides:
 *   post:
 *     summary: Create a new guide profile
 *     description: Người dùng phải đăng nhập và gửi kèm JWT token. user_id lấy từ token.
 *     tags: [Guides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuideInput'
 *     responses:
 *       201:
 *         description: Guide profile created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, createGuide);

/**
 * @swagger
 * /api/guides/profile:
 *   post:
 *     summary: Create guide profile for existing user
 *     tags: [Guides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuideInput'
 *     responses:
 *       201:
 *         description: Guide profile created successfully
 */
router.post("/profile", createGuideProfile);

/**
 * @swagger
 * /api/guides/{id}:
 *   put:
 *     summary: Update guide profile by ID
 *     tags: [Guides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuideInput'
 *     responses:
 *       200:
 *         description: Guide profile updated successfully
 *       404:
 *         description: Guide not found
 */
router.put("/:id", verifyToken, updateGuide);

/**
 * @swagger
 * /api/guides/user/{userId}:
 *   get:
 *     summary: Get guide profile by user ID
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Guide profile found
 *       404:
 *         description: Guide not found
 */
router.get("/user/:userId", getGuideByUserId);

module.exports = router;
