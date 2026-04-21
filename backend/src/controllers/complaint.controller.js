import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  console.log("🟡 [1] createComplaint hit");
  console.log("🟡 [2] req.body:", JSON.stringify(req.body, null, 2));
  console.log("🟡 [3] req.user:", req.user);

  try {
    const {
      type,
      description,
      issueType,
      location,
      images,
      hostelName,
      floor,
      roomNumber,
      locationLandmark,
      locationAddress,
    } = req.body;

    console.log("🟡 [4] Destructured values:", { type, description, issueType, location });

    if (!type || !description || !issueType || !location) {
      console.log("🔴 [5] Validation failed - missing fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (type === "hostel" && (!hostelName || !floor || !roomNumber)) {
      console.log("🔴 [6] Hostel validation failed");
      return res.status(400).json({ message: "Hostel details required" });
    }

    if (type === "campus" && (!locationLandmark || !locationAddress)) {
      console.log("🔴 [7] Campus validation failed");
      return res.status(400).json({ message: "Campus location details required" });
    }

    console.log("🟡 [8] Building coordinates...");
    const coordinates =
      location?.lat != null && location?.lng != null
        ? { type: "Point", coordinates: [location.lng, location.lat] }
        : undefined;
    console.log("🟡 [9] coordinates built:", coordinates);

    console.log("🟡 [10] Calling Complaint.create()...");
    const complaint = await Complaint.create({
      citizenId: req.user.id,
      type,
      description,
      issueType,
      location,
      images,
      hostelName,
      floor,
      roomNumber,
      locationLandmark,
      locationAddress,
      coordinates,
    });
    console.log("✅ [11] Complaint created:", complaint._id);

    res.status(201).json({ message: "Complaint created successfully", complaint });

  } catch (error) {
    console.log("🔴 [ERROR] caught in catch block:");
    console.log("🔴 name:", error.name);
    console.log("🔴 message:", error.message);
    console.log("🔴 stack:", error.stack);
    res.status(500).json({ message: error.message });
  }
};