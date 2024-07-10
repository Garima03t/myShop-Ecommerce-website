import Order from "@/models/Order";
import db from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust the path if necessary

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session && !session.user.isAdmin)) {
    res.status(401).send("Admin signin required");
  }

  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const devliveredOrder = await order.save();
    await db.disconnect();
    res.send({
      message: "Order delivered successfully",
      order: devliveredOrder,
    });
  } else {
    await db.disconnect();
    res.status(404).send({
      message: "Error: order not found",
    });
  }
};

export default handler;
