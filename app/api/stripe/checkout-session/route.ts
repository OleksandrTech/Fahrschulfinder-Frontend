// src/app/api/stripe/checkout-session/route.ts
import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { data: school } = await supabase
            .from('driving_school')
            .select('id')
            .eq('admin_id', user.id)
            .single();

        if (!school) {
            return new NextResponse('School not found', { status: 404 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: 'price_1SE40iKqI50MWETfV2SxpNNm', // Replace with your Stripe Price ID
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/profile?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/profile`,
            metadata: {
                schoolId: school.id,
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}