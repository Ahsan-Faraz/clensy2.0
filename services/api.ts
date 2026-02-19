import { toast } from "sonner";
import type {
  ApiToken,
  ScopeGroup,
  ServiceScope,
  PostalCode,
  Question,
  Lead,
  RateModification,
  AvailabilitySlot,
  BillingTerm,
} from "../types/booking";

interface ApiResponse<T> {
  IsSuccess: boolean;
  Message: string;
  Result: T;
  InnerException: any;
  StatusCode: number;
}

interface ApiScopeGroup {
  ScopeGroupId: number;
  Name: string;
  Scopes: Array<{
    ScopeId: number;
    Name: string;
    IsRequired: boolean;
    Frequencies: Array<{
      FrequencyId: string;
      Name: string;
    }>;
  }>;
}

interface ApiPostalCode {
  PostalCode: string;
  ZoneName: string;
  ZoneId: number;
}

class ApiService {
  private baseURL = "https://clensy.maidcentral.com/api";
  private token: ApiToken | null = null;
  private tokenPromise: Promise<ApiToken> | null = null;
  private validPostalCodes: Set<string> | null = null;
  private postalCodesPromise: Promise<Set<string>> | null = null;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getToken();
    const headers: HeadersInit = {
      Accept:
        "application/json, text/json, application/xml, text/xml, text/html",
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${token.access_token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired, refresh and retry
      this.token = null;
      this.tokenPromise = null;
      const newToken = await this.getToken();
      if (newToken) {
        (headers as Record<string, string>)["Authorization"] =
          `Bearer ${newToken.access_token}`;
        const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers,
        });
        return retryResponse.json();
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async getToken(): Promise<ApiToken> {
    if (this.token && this.token.expires_at > Date.now()) {
      return this.token;
    }

    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    this.tokenPromise = this.fetchToken();
    try {
      this.token = await this.tokenPromise;
      return this.token;
    } finally {
      this.tokenPromise = null;
    }
  }

  private async fetchToken(): Promise<ApiToken> {
    try {
      const response = await fetch("https://api.maidcentral.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: "MC.92c803f7621f181d8716ee764021fbed",
          password: "623e55f158894e008a49d42cca9d",
          grant_type: "password",
        }),
      });

      if (!response.ok) {
        throw new Error(`Token fetch failed: ${response.status}`);
      }

      const data = await response.json();
      const token: ApiToken = {
        ...data,
        expires_at: Date.now() + data.expires_in * 1000,
      };

      return token;
    } catch (error) {
      console.error("Failed to fetch token:", error);
      toast.error("Authentication failed. Please try again.");
      throw error;
    }
  }

  private async getValidPostalCodes(): Promise<Set<string>> {
    if (this.validPostalCodes) {
      return this.validPostalCodes;
    }

    if (this.postalCodesPromise) {
      return this.postalCodesPromise;
    }

    this.postalCodesPromise = this.fetchValidPostalCodes();
    try {
      this.validPostalCodes = await this.postalCodesPromise;
      return this.validPostalCodes;
    } finally {
      this.postalCodesPromise = null;
    }
  }

  private async fetchValidPostalCodes(): Promise<Set<string>> {
    try {
      const response: ApiResponse<ApiPostalCode[]> =
        await this.request("/Lead/PostalCodes");

      if (!response.IsSuccess) {
        throw new Error(response.Message || "Failed to fetch postal codes");
      }

      // Create a Set of valid postal codes for fast lookup
      const validCodes = new Set(
        response.Result.map((item) => item.PostalCode),
      );
      return validCodes;
    } catch (error) {
      console.error("Failed to fetch postal codes:", error);
      // Return empty set on error to avoid blocking the form
      return new Set<string>();
    }
  }

  // Lead Information and Service Selection APIs
  async getScopeGroups(): Promise<ScopeGroup[]> {
    try {
      const response: ApiResponse<ApiScopeGroup[]> =
        await this.request("/Lead/ScopeGroups");

      if (!response.IsSuccess) {
        throw new Error(response.Message || "Failed to fetch scope groups");
      }

      // Transform API response to match our interface
      return response.Result.map((group) => ({
        id: group.ScopeGroupId.toString(),
        name: group.Name,
        description: `${group.Scopes.length} services available`,
      }));
    } catch (error) {
      console.error("Failed to fetch scope groups:", error);
      toast.error("Failed to load service categories");
      throw error;
    }
  }

  async getScopes(scopeGroupId: string): Promise<ServiceScope[]> {
    try {
      const response: ApiResponse<ApiScopeGroup[]> =
        await this.request("/Lead/ScopeGroups");

      if (!response.IsSuccess) {
        throw new Error(response.Message || "Failed to fetch scopes");
      }

      // Find the specific scope group and return its scopes
      const group = response.Result.find(
        (g) => g.ScopeGroupId.toString() === scopeGroupId,
      );
      if (!group) {
        return [];
      }

      return group.Scopes.map((scope) => ({
        id: scope.ScopeId.toString(),
        name: scope.Name,
        description: `${scope.Frequencies.map((f) => f.Name).join(", ")}`,
        scopeGroupId: scopeGroupId,
        frequencies: scope.Frequencies || [],
      }));
    } catch (error) {
      console.error("Failed to fetch scopes:", error);
      toast.error("Failed to load services");
      throw error;
    }
  }

  async validatePostalCode(code: string): Promise<PostalCode> {
    try {
      const validCodes = await this.getValidPostalCodes();
      const isValid = validCodes.has(code);

      return {
        code,
        isValid,
        serviceArea: isValid ? "Service Available" : "Service Not Available",
      };
    } catch (error) {
      console.error("Failed to validate postal code:", error);
      // Return invalid on error to be safe
      return {
        code,
        isValid: false,
        serviceArea: "Unable to verify service area",
      };
    }
  }

  async getQuestions(scopeIds: string[]): Promise<Question[]> {
    try {
      const response: ApiResponse<Question[]> = await this.request(
        `/Lead/Questions?scopeIds=${scopeIds.join(",")}`,
      );

      if (!response.IsSuccess) {
        throw new Error(response.Message || "Failed to fetch questions");
      }

      // Return ALL questions from the API, sorted by SortOrder
      return response.Result.sort(
        (a, b) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0),
      );
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      toast.error("Failed to load questions");
      throw error;
    }
  }

  async createOrUpdateLead(lead: Lead): Promise<{ leadId: string }> {
    try {
      const response = await this.request<{ leadId: string }>(
        "/Lead/CreateOrUpdate",
        {
          method: "POST",
          body: JSON.stringify(lead),
        },
      );
      return response;
    } catch (error) {
      console.error("Failed to create/update lead:", error);
      toast.error("Failed to save lead information");
      throw error;
    }
  }

  // Quote Creation and Pricing APIs
  async getPricingQuestions(scopeIds: string[]): Promise<Question[]> {
    try {
      const response: ApiResponse<Question[]> = await this.request(
        `/Lead/Questions?scopeIds=${scopeIds.join(",")}`,
      );

      if (!response.IsSuccess) {
        throw new Error(
          response.Message || "Failed to fetch pricing questions",
        );
      }

      // Filter questions for step 2 (During Pricing)
      return response.Result.filter(
        (q) => q.QuestionStepType === "2-During Pricing",
      );
    } catch (error) {
      console.error("Failed to fetch pricing questions:", error);
      toast.error("Failed to load pricing questions");
      throw error;
    }
  }

  async getRateModifications(
    scopeGroupId: string,
  ): Promise<RateModification[]> {
    try {
      const response: ApiResponse<RateModification[]> = await this.request(
        `/Lead/RateModifications?scopeGroupId=${scopeGroupId}`,
      );

      if (!response.IsSuccess) {
        throw new Error(
          response.Message || "Failed to fetch rate modifications",
        );
      }

      return response.Result;
    } catch (error) {
      console.error("Failed to fetch rate modifications:", error);
      toast.error("Failed to load add-ons and modifications");
      throw error;
    }
  }

  async calculatePrice(payload: any): Promise<any> {
    try {
      const response = await this.request<any>("/Lead/CalculatePrice", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error("Complete your quote to calculate pricing:", error);
      throw error;
    }
  }

  // Updated createOrUpdateQuote method to handle the new API structure
  async createOrUpdateQuote(payload: any): Promise<any> {
    try {
      const response = await this.request<any>("/Lead/CreateOrUpdateQuote", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error("Failed to create/update quote:", error);
      toast.error("Failed to save quote");
      throw error;
    }
  }

  // Final Booking APIs
  async getFinalBookingQuestions(scopeIds: string[]): Promise<Question[]> {
    try {
      const response: ApiResponse<Question[]> = await this.request(
        `/Lead/Questions?scopeIds=${scopeIds.join(",")}`,
      );

      if (!response.IsSuccess) {
        throw new Error(
          response.Message || "Failed to fetch booking questions",
        );
      }

      // Filter questions for step 3 (After Pricing)
      return response.Result.filter(
        (q) => q.QuestionStepType === "3-After Pricing",
      );
    } catch (error) {
      console.error("Failed to fetch booking questions:", error);
      toast.error("Failed to load booking questions");
      throw error;
    }
  }

  /**
   * Get availability slots for booking. Pass MainScopeGroupId from Lead as scopeGroupId.
   * @param scopeGroupId MainScopeGroupId from Lead (Clensy Service ID)
   * @param hours Number of hours for the service
   */
  /**
   * Get availability slots for booking. Pass MainScopeGroupId from Lead as scopeGroupId.
   * Handles both array of date strings and array of AvailabilitySlot objects.
   * @param scopeGroupId MainScopeGroupId from Lead (Clensy Service ID)
   * @param hours Number of hours for the service
   */
  async getAvailability(
    scopeGroupId: string,
    hours: number,
  ): Promise<string[] | AvailabilitySlot[]> {
    try {
      // scopeGroupId should be MainScopeGroupId from Lead
      const response = await this.request<any>(
        `/Lead/Availability?scopeGroupId=${scopeGroupId}&hours=${hours}`,
      );
      // MaidCentral API may return array of date strings or array of objects
      if (Array.isArray(response)) {
        // If array of strings (dates)
        if (typeof response[0] === "string") {
          return response as string[];
        }
        // If array of objects (AvailabilitySlot[])
        if (typeof response[0] === "object") {
          return response as AvailabilitySlot[];
        }
      }
      // If wrapped in API response object (Result)
      if (response && Array.isArray(response.Result)) {
        if (typeof response.Result[0] === "string") {
          return response.Result as string[];
        }
        if (typeof response.Result[0] === "object") {
          return response.Result as AvailabilitySlot[];
        }
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast.error("Failed to load available dates");
      throw error;
    }
  }

  async getBillingTerms(): Promise<BillingTerm[]> {
    try {
      const response = await this.request<BillingTerm[]>("/Lead/BillingTerms");
      return response;
    } catch (error) {
      console.error("Failed to fetch billing terms:", error);
      toast.error("Failed to load payment options");
      throw error;
    }
  }

  /**
   * Book a quote with the full JSON body as required by the API.
   * @param requestBody The full booking request body (flat, not nested)
   */
  async bookQuote(requestBody: any): Promise<{ bookingId: string }> {
    try {
      const response = await this.request<{ bookingId: string }>(
        "/Lead/BookQuote",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
      );
      return response;
    } catch (error) {
      console.error("Failed to book quote:", error);
      toast.error("Failed to complete booking");
      throw error;
    }
  }

  async createNote(leadId: string, note: string): Promise<void> {
    try {
      await this.request("/Note/Create", {
        method: "POST",
        body: JSON.stringify({
          leadId,
          note,
          type: "booking",
        }),
      });
    } catch (error) {
      console.error("Failed to create note:", error);
      // Don't show error toast for notes as it's not critical
    }
  }
}

export const apiService = new ApiService();
