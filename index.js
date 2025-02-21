const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration
const allowedOrigins = [
    "https://bfhl-frontend-six-nu.vercel.app",
    "http://localhost:5173"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "full-name", "dob", "email", "roll-number"]
};

app.use(cors(corsOptions));
app.use(express.json());

const isValidInput = (data) => {
    return data.every(item => typeof item === "string" && (/^\d+$/.test(item) || /^[A-Za-z]$/.test(item)));
};

const getHighestAlphabet = (alphabets) => {
    return alphabets.length ? [alphabets.sort((a, b) => a.localeCompare(b)).pop()] : [];
};

app.post("/bfhl", (req, res) => {
    try {
        if (!req.body.data || !Array.isArray(req.body.data) || !isValidInput(req.body.data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input format - only single alphabets (A-Z) or whole numbers allowed"
            });
        }

        // Get user details from request headers (simulate a real scenario)
        const full_name = req.headers["full-name"] || "default_user";
        const dob = req.headers["dob"] || "01011990"; // Default if not provided
        const email = req.headers["email"] || "default@example.com";
        const roll_number = req.headers["roll-number"] || "ROLL123";

        // Generate unique user_id
        const user_id = `${full_name.toLowerCase().replace(/\s+/g, "_")}_${dob}`;

        // Process input data
        const data = req.body.data;
        const numbers = data.filter(item => /^\d+$/.test(item));
        const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));
        const highest_alphabet = getHighestAlphabet(alphabets);

        res.json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
            highest_alphabet
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            is_success: false,
            error: "Server error"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Welcome to API(route to /bfhl)");
});

app.get("/bfhl", (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
