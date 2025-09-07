import type { DocumentInfo, UploadResult, PageResponse, ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const DEFAULT_TIMEOUT = 10000;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = DEFAULT_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async uploadPdf(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/api/pdftohtml`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to process PDF');
    }

    return result;
  }

  async getDocumentInfo(token: string): Promise<PageResponse> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/api/pages/${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Document not found');
      }
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch document information');
    }

    return response.json();
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.getDocumentInfo(token);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Storage utilities
export const storage = {
  setToken(token: string): void {
    localStorage.setItem('pdf_access_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('pdf_access_token');
  },

  clearToken(): void {
    localStorage.removeItem('pdf_access_token');
    localStorage.removeItem('pdf_total_pages');
    localStorage.removeItem('pdf_name');
  },

  setDocumentInfo(info: { totalPages: number; name: string }): void {
    localStorage.setItem('pdf_total_pages', info.totalPages.toString());
    localStorage.setItem('pdf_name', info.name);
  },

  getDocumentInfo(): { totalPages: number | null; name: string | null } {
    const totalPages = localStorage.getItem('pdf_total_pages');
    const name = localStorage.getItem('pdf_name');
    return {
      totalPages: totalPages ? parseInt(totalPages, 10) : null,
      name,
    };
  },
};