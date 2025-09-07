import express from "express";
import { register, login, refresh, logout, me } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", me);
router.get("/", (req, res) => {
  res.send("Auth backend is running!");
});

export default router;
