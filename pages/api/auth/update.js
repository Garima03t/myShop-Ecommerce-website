import bcryptjs from "bcryptjs";
import User from "@/models/User";
import db from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust the path if necessary

const handler = async (req, res) => {
  if (req.method != "PUT") {
    return res.status(400).send({
      message: `${req.method} not supported`,
    });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).send("Signin required");
  }
  const { user } = session;
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();

  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.name = name;
  toUpdateUser.email = email;
  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();

  await db.disconnect();

  res.send({
    message: "User updated",
  });
};

export default handler;
