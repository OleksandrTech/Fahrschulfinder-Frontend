// src/app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/utils/supabase/admin'; // Wichtig: Importiere den neuen Admin-Client
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    // 1. Variable 'event' deklarieren
    let event: Stripe.Event;

    // 2. Event sicher aus der Signatur konstruieren
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // 3. Jetzt 'event' verwenden (es ist nun sicher definiert)
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const schoolId = session.metadata?.schoolId;

        if (!schoolId) {
            return new NextResponse('Webhook Error: Missing schoolId in metadata', {
                status: 400,
            });
        }

        // HIER: Admin Client nutzen, um RLS zu umgehen
        const supabaseAdmin = createAdminClient(); 
        
        const { error } = await supabaseAdmin
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