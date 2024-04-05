const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/route.ts');

const app = express();
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']    
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api",routes);

mongoose.connect("mongodb://localhost:27017/mydb",{
   
})
.then(()=>{
    
    console.log("Connected to database");
    app.listen(3000,()=>{
        console.log("App is listening on port 3000");
    });
    
})
.catch((error) => {
    console.error("Error connecting to database:", error);
});

