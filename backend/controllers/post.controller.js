import { PrismaClient } from "../src/generated/prisma/client.ts";

const prisma = new PrismaClient();



const unauthenticated = (res) => {
  res.status(401).json({ error: "Session expired or invalid" });
}




export const createPost = async (req, res) => {
  try {
    const userId = req.auth.userId;
    // console.log("********userId********", userId)
    // if (!userId) return res.status(401).json({ error: "Not authenticated" });

    // // Extract user email from Clerk session
    // const email = req.auth.sessionClaims.email_address;

    // // 1️⃣ Ensure user exists in your User table
    // await prisma.user.upsert({
    //   where: { id: userId },
    //   update: {},
    //   create: {
    //     id: userId,
    //     email,
    //   },
    // });

    // 2️⃣ Create post
    const { name, content } = req.body;

    console.log("name and content: ", name, content)

    const post = await prisma.post.create({
      data: {
        name,
        content,
        user: {
        connect: { id: userId } // ← Your authenticated user ID
    }
      },
    });

    console.log("posts: ", post)

    res.status(201).json(post);
  } catch (error) {
    console.log("Backend Error: ", error);
    res.status(500).json({ error: error.message });
  }
};



export const getposts = async (req , res) => {
    try {
        const userId = req.auth.userId; // you must set this from your auth middleware
    const posts = await prisma.post.findMany({
      where: { userId },   // 🔥 filter by the logged-in user
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getpost = async (req , res) => {
    try {
        const {id} =  req.params;

        const post = await prisma.post.findUnique({
            where: {id: Number(id)},
        })

        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const deletepost = async (req , res) => {
    try {
        const {id} = req.params;

        const deletePost = await prisma.post.delete({
            where: {id: Number(id)},
        })

        res.status(200).json(deletePost)
    } catch (error) {
       res.status(500).json({message: error.message}) 
    }
}

export const updatepost = async (req , res) => {
    try {
        const {id} = req.params

        const {name, content} = req.body

        const updatePost = await prisma.post.update({
            where: {id: Number(id)},
            data : {name , content},
        })


        res.status(200).json(updatePost)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}