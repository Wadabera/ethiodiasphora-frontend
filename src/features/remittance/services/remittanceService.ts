// features/remittance/services/remittanceService.ts
import type{
  RemittanceRatesResponse,
  RemittanceProvider,
  RemittanceCalculation,
} from "../types/remittance.types";

const API_BASE_URL = "/api/v1";

class RemittanceService {
  // 1.4.1 Get Remittance Rates
  async getRemittanceRates(): Promise<RemittanceRatesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/remittance/rates`);
      if (!response.ok){
        throw new Error(`Failed to fetch remittance rates: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching remittance rates:", error);
      throw error;
    }
  }

  // 1.4.2 Get Remittance Providers
  async getRemittanceProviders(): Promise<RemittanceProvider[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/remittance/providers`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch remittance providers: ${response.status}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching remittance providers:", error);
      throw error;
    }
  }

  // Calculate receive amount
  calculateReceiveAmount(
    sendAmount: number,
    exchangeRate: number,
    fee: number,
    feeType: "fixed" | "percentage",
  ): RemittanceCalculation {
    const calculatedFee = feeType === "fixed" ? fee : (sendAmount * fee) / 100;
    const amountAfterFee = sendAmount - calculatedFee;
    const receiveAmount = amountAfterFee * exchangeRate;

    return {
      sendAmount,
      receiveAmount: Math.round(receiveAmount * 100) / 100,
      fee: calculatedFee,
      exchangeRate,
      provider: "",
      deliveryMethod: "bank_transfer",
      deliveryTime: "",
    };
  }
}

export default new RemittanceService();
