const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const signToken = id=>{
    return jwt.sign({ id } , process.env.JWT_SECRET );
}


exports.signup =async (req , res)=>{
    try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, 
      },
    });
    const token = signToken(newUser.id);
    const { password: _, ...userWithoutPassword } = newUser;



    res.status(201).json({
        data:{
            userWithoutPassword
        },
        token:token
    });

    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
    }
}


exports.login= async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token=signToken(user.id);


    // Success! (In a real app, you'd send a JWT token here)
    // For this assignment, sending the User ID is enough to "log them in" on frontend
    res.status(200).json({
        id:user.id,
        email:user.email,
        name:user.name,
        token:token
    });

  } catch(error){

  }
}



exports.protection = async (req, res, next) => {
  try {
    let token;

    // Extract token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Please log in again",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("MY DECODED TOKEN:", decoded);
    // Find the user
    const currentUser = await prisma.user.findUnique({ 
        where: {
        id: decoded.id
        }
     });

    if (!currentUser) {
      return res.status(403).json({
        status: "fail",
        message: "User no longer exists",
      });
    }

    // Attach user to request
    req.user = currentUser;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
};

