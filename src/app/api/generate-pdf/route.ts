import { NextResponse } from 'next/server';
import { allPrompts } from '../../../../data/prompts';

export async function POST() {
  try {
    // Create PDF content as HTML that can be converted to PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>30 Proven AI Prompts for Making Money Online - Ventaro AI</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1f2937;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      color: #6b7280;
      font-size: 16px;
    }
    .prompt {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .prompt-title {
      color: #1f2937;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 5px;
    }
    .prompt-content {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #10b981;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      color: #6b7280;
    }
    .page-break {
      page-break-before: always;
    }
    @media print {
      body { margin: 0; }
      .prompt { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>30 Proven AI Prompts for Making Money Online</h1>
    <p>Premium Australian-Made AI Tools by Ventaro AI</p>
    <p><strong>www.ventaroai.com</strong></p>
  </div>

  ${allPrompts.map((prompt, index) => `
    <div class="prompt">
      <div class="prompt-title">
        Prompt #${prompt.id}: ${prompt.title}
      </div>
      <div class="prompt-content">
        ${prompt.fullPrompt}
      </div>
    </div>
    ${(index + 1) % 5 === 0 && index < allPrompts.length - 1 ? '<div class="page-break"></div>' : ''}
  `).join('')}

  <div class="footer">
    <p><strong>Thank you for your purchase!</strong></p>
    <p>For support, contact: <strong>chris.t@ventarosales.com</strong></p>
    <p>© 2025 Ventaro AI - Australian-Made AI Solutions</p>
    <p>Visit us at: <strong>www.ventaroai.com</strong></p>
  </div>
</body>
</html>
    `;

    // Return HTML content that can be printed as PDF by the browser
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'inline; filename="30-AI-Prompts-Ventaro.html"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}