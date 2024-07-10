import Order from "@/models/Order";
import db from "@/utils/db";
import { getServerSession  } from "next-auth/react";

const handler = async (req, res) => {
  console.log("orderhit");
  const session = await getServerSession ({ req });
  console.log("session",session);
  if (!session) {
    res.status(401).send("Signin required");
  }
 const { user } = session;
  await db.connect();
  console.log("session",user);
;
  const newOrder = new Order({
    ...req.body,
    isPaid: true,
    paidAt: Date.now(),
    paymentResult: {
      id: "",
      status: "",
      email_address: "",
    },
    user: "668e5da9c0380d3a92d5c57f",
  });
  const order = await newOrder.save();
  await db.disconnect();
  res.status(201).send(order);
};

export default handler;
