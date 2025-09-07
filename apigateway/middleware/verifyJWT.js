import jwt from "jsonwebtoken";
import Session from "../models/Session.js"; 
export default async function verifyJWT(req, res, next) {
    console.log("....Gateway initiated...");
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(" ")[2]; 
    if (!token) return res.status(401).json({ error: "Invalid token format" });
    try {
      console.log(token);
         const decoded = jwt.verify(token, "access_secret_key");
         req.user = decoded;
             console.log("....Gateway verified...");
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}
