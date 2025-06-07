// fileParser.js
import fs from "fs";
// import pdf from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extract raw text from different file types based on mimeType.
 * Supports PDF, DOCX, and plain text files.
 *
 * @param {string} filePath - Path to the file.
 * @param {string} mimeType - MIME type of the file.
 * @returns {Promise<string>} - Extracted text content.
 */
export const extractTextFromFile = async (filePath, mimeType) => {
  if (mimeType === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    return data.text;
  } else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // DOCX mime type
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value; // extracted raw text
  } else if (mimeType === "text/plain") {
    return fs.readFileSync(filePath, "utf-8");
  } else {
    throw new Error("Unsupported file type for text extraction");
  }
};

/**
 * Extract specific fields from raw text:
 * - Email address
 * - Phone number
 * - Experience summary (text after "Experience" keyword)
 *
 * @param {string} text - Raw extracted text.
 * @returns {Object} - Extracted fields.
 */
export function extractFieldsFromText(text) {
  const blocks = [];

  // Split into blocks using "Role:" as a delimiter
  const roleSections = text.split(/(?=role[:])/i);

  for (const section of roleSections) {
    const roleMatch = section.match(/role[:\s]*([^\n]+)/i);
    const role = roleMatch ? roleMatch[1].trim() : "";

    const companyMatch = section.match(/company[:\s]*([^\n]+)/i);
    const company = companyMatch ? companyMatch[1].trim() : "";

    const dutiesMatch = section.match(/duties[:\s]*([\s\S]*)/i);
    let duties = [];
    if (dutiesMatch) {
      duties = dutiesMatch[1]
        .split(/[\n•-]+/)
        .map((line) => line.trim())
        .filter(Boolean);
    }

    if (role || company || duties.length > 0) {
      blocks.push({ role, company, duties });
    }
  }

  return blocks;
}
