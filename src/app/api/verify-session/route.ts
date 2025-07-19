import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the session is valid and payment was successful
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        valid: true,
        customerEmail: session.customer_details?.email,
        paymentStatus: session.payment_status,
        sessionId: session.id
      });
    } else {
      return NextResponse.json(
        { valid: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { valid: false, error: 'Invalid session' },
      { status: 400 }
    );
  }
}