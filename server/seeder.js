import dotenv from "dotenv";
import colors from "colors";
import bcrypt from "bcryptjs";
import { connectDB, prisma } from "#config/db.config.js";
import customers from "#data/customer.js";
import gstItems from "#data/gstItems.js";
import Items from "#data/items.js";
import items from "#data/items.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    const user = await prisma.user.create({
      data: {
        name: "ronak",
        email: "ronak@gmail.com",
        password: await hashPassword("ronak@123"),
        isAdmin: true,
      },
    });

    await prisma.customer.createMany({
      data: customers.map((customer) => ({ userId: user.id, ...customer })),
    });

    await prisma.gstItems.createMany({
      data: gstItems.map((gstItem) => ({ userId: user.id, ...gstItem })),
    });

    await prisma.cashItems.createMany({
      data: items.map((gstItem) => ({ userId: 9, ...gstItem })),
    });

    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error.message}`.red.inverse.underline);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await prisma.user.deleteMany();
    await prisma.customer.deleteMany();
    console.log("Data destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error.message}`.red.inverse.underline);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
