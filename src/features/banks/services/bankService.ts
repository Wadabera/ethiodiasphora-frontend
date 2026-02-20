// features/banks/services/bankService.ts
import type{
  Bank,
  ExchangeRatesResponse,
  BankSearchParams,
} from "../types/bank.types";

const API_BASE_URL = "/api/v1";

class BankService {
  // 1.2.1 Get All Banks
  async getAllBanks(): Promise<Bank[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/banks`);
      if (!response.ok) {
        throw new Error(`Failed to fetch banks: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching banks:", error);
      throw error;
    }
  }

  // 1.2.2 Search Banks
  async searchBanks(params: BankSearchParams): Promise<Bank[]> {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/banks/search?${queryString}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to search banks: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error searching banks:", error);
      throw error;
    }
  }

  // 1.3.1 Get Exchange Rates
  async getExchangeRates(): Promise<ExchangeRatesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/currency/rates`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      throw error;
    }
  }
}

export default new BankService();
