//1. Require files and libraries
import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import helmet from 'helmet'; // For security headers
import rateLimit from 'express-rate-limit'; // For rate limiting
import cors from 'cors';
// import {auth} from './middlewares/auth.middleware.js';
import urlRoutes from './routes/url.routes.js';
import dotenv from 'dotenv';
//2. Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

//3. Ensure essential environment variables are set
if(!process.env.DATABASE_URL || !process.env.JWT_SECRET){
    console.error("Critical environment variables are missing.");
    process.exit(1);//Exit with failure
}
//4. Initialize express app
const app = express();

//5. Connect to the database
import {connect} from './config/database.js'
connect();



//6. Use middleware
app.use(express.json());//Parse JSON payloads
app.use(cookieParser());//Parse cookies
app.use(express.urlencoded({ extended: true }));//Parse URL-encoded payloads
// app.use(
//     helmet({
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'"],
//           scriptSrc: ["'self'",process.env.FRONTEND_URL, "http://localhost:5173"],
//           connectSrc: ["'self'",process.env.BACKEND_URL,'https://shortly-frontend.onrender.com', "http://localhost:4000"],
//         },
//       },
//       crossOriginEmbedderPolicy: true, // Disable if interfering
//     })
//   );//Set secure HTTP headers
// // CORS Configuration
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     if (req.method === 'OPTIONS') {
//       return res.sendStatus(204); // Respond to preflight request
//     }
//     next();
//   });
  
//cors to handle cors policy
app.use(cors({
    origin: ['https://shortly-f.vercel.app','https://shortly-f-rahul-kumars-projects-cdeca0dc.vercel.app','http://localhost:5173'], // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies/auth headers
}));

// Preflight request handling
app.options('*', cors());
// Set proxy trust (required for secure cookies on Render)
app.set("trust proxy", true);
//7. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 min
    max: 100, //Limit each IP to 100 requests per windowMs
    message:{
        success:false,
        message:"Too many requests, please try again later.",
    }
});
// app.use(limiter);

//8. Define routes
app.use("/api/v1",userRoutes);
app.use("/url",urlRoutes);

//9. Health check route
app.get("/ping", (req, res) => {
    return res.send('<h1 style="color:red; font-size:200px;">PONG</h1>'); 
});

//10. Handle undefined routes
app.use((req,res,next)=>{
    res.status(404).json({
        success:false,
        message:"Route not found.",
    });
});

//11. Centralized error handling
app.use((err, req, res, next)=>{
    console.error(`Error: ${err.message}`);
    res.status(500).json({
        success:false,
        message:"An internal server error occurred.",
    });
});
//12. Start the server
app.listen(PORT, ()=>{
    console.log("Server run at ",PORT);
});
