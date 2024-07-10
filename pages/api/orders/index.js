import Order from "@/models/Order";
import db from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust the path if necessary

const handler = async (req, res) => {
  console.log("orderhit");
  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);
  if (!session) {
    return res.status(401).send("Signin required");
  }
  
  const { user } = session;
  await db.connect();
  console.log("user", user);

  const newOrder = new Order({
    ...req.body,
    isPaid: true,
    paidAt: Date.now(),
    paymentResult: {
      id: "",
      status: "",
      email_address: "",
    },
    user: user.id, // Ensure user.id is the correct field
  });
  
  const order = await newOrder.save();
  await db.disconnect();
  res.status(201).send(order);
};

export default handler;
