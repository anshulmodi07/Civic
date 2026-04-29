export const validateComplaint = (data) => {
  if (!["hostel", "campus"].includes(data.type)) {
    throw new Error("Complaint type must be hostel or campus");
  }

  if (!data.description || data.description.length < 20) {
    throw new Error("Description must be at least 20 characters");
  }

  if (data.description.length > 500) {
    throw new Error("Description cannot exceed 500 characters");
  }

  if (!data.departmentId) {
    throw new Error("Department is required");
  }

  if (!Number.isFinite(Number(data.location?.lat)) || !Number.isFinite(Number(data.location?.lng))) {
    throw new Error("Location is required");
  }

  data.location = {
    lat: Number(data.location.lat),
    lng: Number(data.location.lng),
  };

  if (data.type === "hostel") {
    if (!data.hostelName || !data.floor) {
      throw new Error("Hostel name and floor required");
    }

    if (data.visibility === "private" && !data.roomNumber) {
      throw new Error("Room number required for private complaint");
    }

    if (data.visibility === "public" && !data.landmark) {
      throw new Error("Landmark required for public complaint");
    }
  }

  if (data.type === "campus") {
    if (!data.area || !data.locationAddress) {
      throw new Error("Area and address required for campus complaint");
    }
  }
};
