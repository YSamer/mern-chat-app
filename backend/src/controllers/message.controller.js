import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
      isActive: true,
    }).select("-password");
    res
      .status(200)
      .json({ filteredUsers, success: true, message: "Users fetched" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId: userToChatId } = req.params;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId },
      ],
    });

    res
      .status(200)
      .json({ messages, success: true, message: "Messages fetched" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content, image } = req.body;
    const { userId: userToChatId } = req.params;
    const loggedInUserId = req.user._id;

    let imageUrl = null;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "messages",
      });
      imageUrl = uploadedImage.secure_url;
    }

    const message = await Message.create({
      senderId: loggedInUserId,
      receiverId: userToChatId,
      content,
      image: imageUrl,
    });

    // const populatedMessage = await Message.populate(message, "senderId");

    // TODO: Emit event to update the conversation real-time
    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(200).json({
      newMessage: message,
      success: true,
      message: "Message sent",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};
