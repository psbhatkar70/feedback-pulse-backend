const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.addfeedBack=async (req, res) => {
  const { message, id ,name , type} = req.body; 

  try {
    const project = await prisma.project.findUnique({
      where: { id: id }
    });

    if (!project) {
      return res.status(404).json({ error: "Invalid Project Key" });
    }

    const feedback = await prisma.feedback.create({
      data: {
        message,
        name,
        type,
        projectId: project.id,

      }
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
        const { projectId, type } = req.body; 
        let queryFilters = {
            projectId: projectId
        };

        if (type && type !== 'All') {
            queryFilters.type = type;
        }

        const feedbacks = await prisma.feedback.findMany({
            where: queryFilters
        });

        res.status(200).json({
            data: {
                feedbacks
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
}