const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"]
}));
const path = require('path');
app.use(express.json())

const userRoutes=require('./routes/userRoutes');
const projectRoutes= require('./routes/projectRoutes');
const feedbackRoutes=require('./routes/feedbackRoutes');
app.use('/api/v1/feedback',feedbackRoutes)
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/projects',projectRoutes);

app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, './widget.js'));
});


app.listen(3000,()=>{
    console.log("Server started");
})