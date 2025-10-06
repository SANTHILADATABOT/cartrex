const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createCustomer(email, name) {
    try {
      const customer = await stripe.customers.create({
        email,
        name
      });
      return customer;
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount, currency = 'usd', customerId, metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customer: customerId,
        metadata,
        capture_method: 'manual' // For authorization without immediate capture
      });
      return paymentIntent;
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  }

  async capturePayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Capture payment error:', error);
      throw error;
    }
  }

  async cancelPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Cancel payment error:', error);
      throw error;
    }
  }

  async createRefund(paymentIntentId, amount) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined
      });
      return refund;
    } catch (error) {
      console.error('Create refund error:', error);
      throw error;
    }
  }

  async attachPaymentMethod(paymentMethodId, customerId) {
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
      return { success: true };
    } catch (error) {
      console.error('Attach payment method error:', error);
      throw error;
    }
  }

  async createSetupIntent(customerId) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId
      });
      return setupIntent;
    } catch (error) {
      console.error('Create setup intent error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
