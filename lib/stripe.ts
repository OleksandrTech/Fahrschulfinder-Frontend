import Stripe from 'stripe';

// ÄNDERUNG HIER: Wir fügen einen Fallback hinzu (|| 'sk_test_dummy')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2025-09-30.clover' as any, // 'as any' verhindert Versions-Meckern
    typescript: true,
});

export { stripe };