// src/app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const schoolId = session.metadata?.schoolId;

        if (!schoolId) {
            return new NextResponse('Webhook Error: Missing schoolId in metadata', {
                status: 400,
            });
        }

        const supabase = createClient();
        const { error } = await supabase
            .from('driving_school')
            .update({ is_premium: true })
            .eq('id', schoolId);

        if (error) {
            console.error('Error updating school to premium:', error);
            return new NextResponse('Webhook Error: Could not update school status', {
                status: 500,
            });
        }
    }

    return new NextResponse(null, { status: 200 });
}