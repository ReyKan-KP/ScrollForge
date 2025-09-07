export interface DocumentInfo {
  pdf_name: string;
  total_pages: number;
  page_count?: number;
}

export interface UploadResult {
  success: boolean;
  message: string;
  token?: string;
  total_pages?: number;
}

export interface PageGroup {
  start: number;
  end: number;
}

export interface ApiError {
  error: string;
  detail?: string;
}

export interface PageResponse {
  success: boolean;
  pdf_name: string;
  page_count: number;
  total_pages: number;
}