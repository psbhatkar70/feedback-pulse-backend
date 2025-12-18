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
        // 1. Extract projectId and the filter type from the request
        const { projectId, type } = req.body; 

        // 2. Build the "where" object
        let queryFilters = {
            projectId: projectId
        };

        // 3. If a type exists and is NOT "All", add it to the filter
        if (type && type !== 'All') {
            queryFilters.type = type;
        }

        // 4. Pass the object to Prisma
        const feedbacks = await prisma.feedback.findMany({
            where: queryFilters
        });

        res.status(200).json({ // Changed to 200 (OK) instead of 201 (Created)
            data: {
                feedbacks
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
}