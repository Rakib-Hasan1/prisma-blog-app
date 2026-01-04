import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("***** Admin seeding stated...");
    const adminData = {
      name: "Admin2 Bhai",
      email: "admin2@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };

    console.log("***** Checking admin exists or not");

    // check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("user already exits!!");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signUpAdmin.ok) {
      console.log("***** Admin created");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });

      console.log("***** Email verification updated");
    }
    console.log("******* Success ******");
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
