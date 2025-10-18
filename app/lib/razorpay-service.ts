/**
 * Razorpay Service for handling payment orders and verification
 */

import Razorpay from 'razorpay'

export interface CreateOrderParams {
  amount: number // in paise
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

export interface VerifyPaymentParams {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

class RazorpayService {
  private razorpay: Razorpay

  constructor() {
    // Initialize Razorpay with your key ID and secret
    // In production, these should be environment variables
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXX',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
    })
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(params: CreateOrderParams) {
    try {
      const order = await this.razorpay.orders.create({
        amount: params.amount,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes,
        payment_capture: 1
      })
      return order
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  verifyPaymentSignature(params: VerifyPaymentParams): boolean {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params

      // Create the expected signature
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      // Compare signatures
      return expectedSignature === razorpay_signature
    } catch (error) {
      console.error('Error verifying payment signature:', error)
      return false
    }
  }

  /**
   * Fetch payment details
   */
  async fetchPayment(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId)
      return payment
    } catch (error) {
      console.error('Error fetching payment details:', error)
      throw error
    }
  }

  /**
   * Fetch order details
   */
  async fetchOrder(orderId: string) {
    try {
      const order = await this.razorpay.orders.fetch(orderId)
      return order
    } catch (error) {
      console.error('Error fetching order details:', error)
      throw error
    }
  }
}

export { RazorpayService }
export default RazorpayService