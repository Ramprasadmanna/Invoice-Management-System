import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient({ log: ["query"] });
const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(`MySQL Connected Sucessfully`.brightCyan.underline);
  } catch (error) {
    console.error(`MongoDB Connection Error : ${error.message}`);
    process.exit(1);
  }
};

export { prisma, connectDB };
