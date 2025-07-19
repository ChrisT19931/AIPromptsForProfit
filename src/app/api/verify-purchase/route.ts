import { NextRequest, NextResponse } from 'next/server';

// In a real application, you would check against your database
// For now, we'll use a simple mock system
const purchasedEmails = new Set<string>([]);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Admin access
    if (email === 'chris.t@ventarosales.com') {
      return NextResponse.json({
        hasPurchased: true,
        isAdmin: true,
        message: 'Admin access granted'
      });
    }

    // Check if email has purchased
    // In a real app, you would query your database here
    // For demo purposes, we'll check against Stripe or a mock list
    const hasPurchased = purchasedEmails.has(email.toLowerCase());

    // TODO: Integrate with Stripe to check actual purchases
    // You could also check against your database of completed orders
    
    return NextResponse.json({
      hasPurchased,
      isAdmin: false,
      message: hasPurchased 
        ? 'Purchase verified' 
        : 'No purchase found for this email'
    });

  } catch (error) {
    console.error('Error verifying purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to add email to purchased list (called from webhook)
function addPurchasedEmail(email: string) {
  (purchasedEmails as Set<string>).add(email.toLowerCase());
}