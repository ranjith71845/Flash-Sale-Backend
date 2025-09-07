import argon2 from "argon2";
import User from "../models/User.js";
import Session from "../models/Session.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utlis/jwt.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    console.log(password);

    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password must be a string" });
    }
    const hash = await argon2.hash(password);
    const user = await User.create({
      email,
      password: hash,
      username: email
    });
    res.json({ message: "User registered", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
    const session = await Session.findOneAndUpdate(
      { userId: user._id }, 
      {
        userId: user._id,
        refreshToken: await argon2.hash(refreshToken), 
        accessToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      },
      { upsert: true, new: true } 
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function refresh(req, res) {
  try {
    console.log("refresh initated");
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });
    let decoded;
    try {
      decoded = await verifyRefreshToken(token);
      console.log(decoded);
    } catch {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    const query_data={
      userId:decoded.id
    }
    const session = await Session.findOne(query_data);
    console.log("session",session);
    if (!session) return res.status(401).json({ error: "Session not found" });

    const valid = await argon2.verify(session.refreshToken, token);
    if (!valid) return res.status(401).json({ error: "Invalid refresh token" });

    session.rotationCounter += 1;
    const newRT = generateRefreshToken({ _id: session.userId, email: decoded.email });
    session.refreshToken = await argon2.hash(newRT);
    await session.save();

    const accessToken = generateAccessToken({ _id: session.userId, email: decoded.email });

    res.cookie("refreshToken", newRT, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function logout(req, res) {
  try {
    if (req.userId) {
      await Session.deleteOne({userId:req.id});
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
