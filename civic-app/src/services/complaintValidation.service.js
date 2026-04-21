/**
 * Complaint Validation Service
 * Provides validation and quality checks for complaint submissions
 */

export const validateComplaintDescription = (description) => {
  const issues = [];

  // Check for empty/very short description
  if (!description || description.trim().length === 0) {
    issues.push({
      type: "EMPTY",
      message: "Please provide a description",
      severity: "error",
    });
    return issues;
  }

  const trimmed = description.trim();

  // Check minimum length (20 characters)
  if (trimmed.length < 20) {
    issues.push({
      type: "TOO_SHORT",
      message: "Description should be at least 20 characters",
      severity: "error",
    });
  }

  // Check for all caps (likely spam)
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 10) {
    issues.push({
      type: "ALL_CAPS",
      message: "Please avoid using all capital letters",
      severity: "warning",
    });
  }

  // Check for excessive punctuation
  const punctuationCount = (trimmed.match(/[!?]{2,}/g) || []).length;
  if (punctuationCount > 2) {
    issues.push({
      type: "EXCESSIVE_PUNCTUATION",
      message: "Please avoid excessive punctuation marks",
      severity: "warning",
    });
  }

  // Check for meaningful content (not just repeated characters)
  const uniqueChars = new Set(trimmed).size;
  if (uniqueChars < 5) {
    issues.push({
      type: "LOW_VARIETY",
      message: "Please provide more detailed information",
      severity: "error",
    });
  }

  return issues;
};

export const validateComplaintForm = (data) => {
  const issues = [];

  // Validate description
  const descValidation = validateComplaintDescription(data.description);
  issues.push(...descValidation);

  // For hostel complaints
  if (data.type === "hostel") {
    if (!data.hostelName) {
      issues.push({
        type: "MISSING_HOSTEL",
        message: "Please select a hostel",
        severity: "error",
      });
    }
    if (!data.floor) {
      issues.push({
        type: "MISSING_FLOOR",
        message: "Please enter floor number",
        severity: "error",
      });
    }
    if (!data.roomNumber) {
      issues.push({
        type: "MISSING_ROOM",
        message: "Please enter room number",
        severity: "error",
      });
    }
  }

  // For campus complaints
  if (data.type === "campus") {
    if (!data.locationLandmark && !data.locationAddress) {
      issues.push({
        type: "MISSING_LOCATION",
        message: "Please select a landmark or enter an address",
        severity: "error",
      });
    }
  }

  if (!data.issueType) {
    issues.push({
      type: "MISSING_ISSUE_TYPE",
      message: "Please select an issue type",
      severity: "error",
    });
  }

  return issues;
};

export const hasErrorIssues = (issues) => {
  return issues.some((issue) => issue.severity === "error");
};

export const getErrorMessages = (issues) => {
  return issues
    .filter((issue) => issue.severity === "error")
    .map((issue) => issue.message)
    .join("\n");
};
