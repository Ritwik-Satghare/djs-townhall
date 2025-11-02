const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

/**
 * Sends a notification to all users when a new event is created
 * @param {Object} event - The event document just created
 */
const sendNotificationToAllUsers = async (event) => {
  try {
    // Fetch all users
    const users = await User.find({}, "_id");

    if (!users.length) {
      console.log(" No users found to notify.");
      return;
    }

    // Create notification objects
    const notifications = users.map((user) => ({
      user: user._id,
      eventId: event._id,
      eventName: event.name,
    //   clubId: event.clubId, // FIXME: ts is not done yet
      clubName: event.clubName || "NOT INCLUDED",
      message: event.message,
    }));

    // Insert all notifications
    await Notification.insertMany(notifications);
    console.log(`Notifications created for ${users.length} users.`);
  } catch (error) {
    console.error("Error creating notifications:", error.message);
  }
};

module.exports = { sendNotificationToAllUsers };