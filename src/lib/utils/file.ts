import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "./constants";

export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function validateFileType(file: File): boolean {
  return (ALLOWED_FILE_TYPES as readonly string[]).includes(file.type);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!validateFileSize(file)) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`,
    };
  }
  if (!validateFileType(file)) {
    return {
      valid: false,
      error: "File type not allowed. Accepted types: PDF, JPEG, PNG",
    };
  }
  return { valid: true };
}

export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return "";
  return fileName.slice(lastDot + 1).toLowerCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, i);
  return `${parseFloat(size.toFixed(1))} ${units[i]}`;
}

export function generateUploadPath(
  userId: string,
  certType: number,
  fileName: string
): string {
  const ext = getFileExtension(fileName);
  const timestamp = Date.now();
  return `certifications/${userId}/${certType}/${timestamp}.${ext}`;
}
