// ====================================================================
// CineBook Payment Sandbox Foundation Service
// Strict Rule: Real payment gateway is NOT connected yet.
// No real UPI or phone numbers are connected.
// ====================================================================

import type { Payment, PaymentGateway, PaymentStatus } from '../../types';

export interface SandboxPaymentIntent {
  orderId: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
}

export async function createSandboxPaymentOrder(amount: number): Promise<SandboxPaymentIntent> {
  // Sandbox test order generation
  const orderId = `order_sandbox_${Math.random().toString(36).substring(2, 10)}`;
  return {
    orderId,
    amount,
    currency: 'INR',
    gateway: 'SANDBOX',
    status: 'PENDING',
  };
}

export async function processSandboxPayment(orderId: string, amount: number): Promise<{ success: boolean; paymentRecord: Partial<Payment>; message: string }> {
  // Simulation of sandbox state transition
  const transactionId = `txn_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    success: true,
    paymentRecord: {
      order_id: orderId,
      transaction_id: transactionId,
      amount,
      currency: 'INR',
      payment_gateway: 'SANDBOX',
      status: 'SUCCESS',
      created_at: new Date().toISOString(),
    },
    message: 'Sandbox test transaction processed successfully (No real money deducted)',
  };
}
