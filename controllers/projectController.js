const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProject= async (req , res)=>{
    const { name } =req.body;

    try {
        const newproject = await prisma.project.create({
            data:{
                name,
                userId:req.user.id
            } 
        })
        const script = `<script src="http://127.0.0.1:3000/widget.js" data-project-id="${newproject.id}"></script>`
        const finalProject = await prisma.project.update({
        where: { id: newproject.id },
        data: { script: script }
        });
        res.status(201).json({
            data:finalProject,
            script:script
        })
    } catch (error) {
        res.status(400).json({
            msg:"Fail"
        });
        console.log(error)
    }
}

exports.getAllProjects= async (req , res)=>{

    try {
       const allprojects = await prisma.project.findMany({where :{userId: req.user.id}})

        res.status(200).json({
            data:{
                allprojects
            }
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getSingleProject= async (req , res)=>{

    try {
    // const id =req.body;
    const project = await prisma.project.findUnique({where :{id: req.body.id}})

        res.status(201).json({
            data:{
                project
            }
        })
    } catch (error) {
        console.log(error)
    }
}