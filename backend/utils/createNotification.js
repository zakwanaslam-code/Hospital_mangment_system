import Notification from "../models/Notification.js";

const createNotification = async ({
  receiver,
  sender = null,
  title,
  message,
  type = "system",
  link = "",
}) => {
  try {
    const notification = await Notification.create({
      receiver,
      sender,
      title,
      message,
      type,
      link,
    });

  if(io){

    io.to(receiver.toString()).emit(
      "notification:new",
      notification
    );

  }
  
     return notification;
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error.message);
    return null;
  }
};

export default createNotification;