import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    console.log("Gateway initiated...");
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }
    const token = authHeader.split(" ")[2];
    if (!token) return res.status(401).json({ message: "Token not found" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default requireAuth;
