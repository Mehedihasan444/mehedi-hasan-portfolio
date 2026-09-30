import { API_BASE } from "./constants";

class ApiClient {
  private token: string | null = null;
  private initialized = false;

  private ensureToken() {
    if (!this.initialized && typeof window !== "undefined") {
      this.initialized = true;
      try {
        this.token = localStorage.getItem("admin_token");
      } catch {
        this.token = null;
      }
    }
    if (typeof window !== "undefined" && !this.token) {
      try {
        const t = localStorage.getItem("admin_token");
        if (t && t !== this.token) this.token = t;
      } catch {
        /* ignore */
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    this.initialized = true;
    if (typeof window === "undefined") return;
    try {
      if (token) {
        localStorage.setItem("admin_token", token);
      } else {
        localStorage.removeItem("admin_token");
      }
    } catch {
      /* storage unavailable */
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    this.ensureToken();
    const headers = new Headers(options.headers);
    const isFormData = options.body instanceof FormData;

    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let res: Response;
    try {
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: "include",
      });
    } catch (e) {
      throw new Error(
        e instanceof Error && e.name === "AbortError" ? "Request timed out" : "Network error",
      );
    } finally {
      clearTimeout(timeout);
    }

    const contentType = res.headers.get("content-type") || "";
    let data: unknown = null;
    if (contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      const text = await res.text().catch(() => "");
      data = text ? { message: text.slice(0, 500) } : null;
    }

    if (!res.ok) {
      if (res.status === 401 && typeof window !== "undefined") {
        this.setToken(null);
        if (
          window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login"
        ) {
          window.location.href = "/admin/login";
        }
      }
      const msg =
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
          ? (data as { message: string }).message
          : "Request failed";
      throw new Error(msg);
    }

    if (data && typeof data === "object" && "data" in data) {
      return (data as { data: T }).data ?? (data as T);
    }
    return data as T;
  }

  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async upload<T>(endpoint: string, formData: FormData) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
    });
  }

  async login(email: string, password: string) {
    const data = await this.post<{ token: string; user: Record<string, unknown> }>("/auth/login", {
      email,
      password,
    });
    if (!data || !data.token) throw new Error("Login failed: no token");
    this.setToken(data.token);
    return data;
  }

  async logout() {
    try {
      await this.post("/auth/logout", {});
    } catch {
      /* ignore */
    }
    this.setToken(null);
  }
}

export const api = new ApiClient();
