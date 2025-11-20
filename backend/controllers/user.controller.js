import { PrismaClient } from "../src/generated/prisma/client.ts";


const prisma = new PrismaClient()

export const ensureUser = async (req, res) => {
  try {
    const { userId, email, name } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ message: "Missing userId or email" });
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist → create it
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,       // Clerk ID as Prisma ID
          email: email,
          name: name || "",
        },
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log("Ensure User Error:", error);
    res.status(500).json({ error: error.message });
  }
};
