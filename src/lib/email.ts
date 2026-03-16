import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

interface OrderEmailPayload {
  to: string;
  subjectName: string;
  orderId: string;
  characters: string[];
  photoCount: number;
}

function buildOrderEmailHtml(p: OrderEmailPayload): string {
  const charList = p.characters
    .map((c) => `<li style="margin:4px 0;">${c}</li>`)
    .join('');

  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:white;font-size:28px;font-weight:800;letter-spacing:-0.5px;">MemoReals</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">זיכרונות אמיתיים בגרסה דמיונית</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="font-size:26px;margin:0 0 8px;text-align:center;">🎉</p>
            <h2 style="text-align:center;font-size:22px;color:#2d3748;margin:0 0 8px;">ההזמנה התקבלה!</h2>
            <p style="text-align:center;color:#718096;font-size:15px;margin:0 0 32px;">
              איזה כיף! אנחנו כבר מתחילים לעבוד על יצירת הקסם שלכם 🪄
            </p>

            <!-- Details box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:13px;color:#a0aec0;font-weight:600;text-transform:uppercase;">שם המשתתף</p>
                  <p style="margin:0 0 16px;font-size:17px;font-weight:700;color:#2d3748;">${p.subjectName}</p>
                  <p style="margin:0 0 6px;font-size:13px;color:#a0aec0;font-weight:600;text-transform:uppercase;">מספר הזמנה</p>
                  <p style="margin:0 0 16px;font-size:13px;font-family:monospace;color:#667eea;">${p.orderId}</p>
                  <p style="margin:0 0 6px;font-size:13px;color:#a0aec0;font-weight:600;text-transform:uppercase;">תמונות שהועלו</p>
                  <p style="margin:0;font-size:15px;color:#2d3748;">${p.photoCount} תמונות</p>
                </td>
              </tr>
            </table>

            <!-- Characters -->
            <p style="font-size:14px;font-weight:700;color:#4a5568;margin:0 0 10px;">הדמויות שנבחרו (${p.characters.length}):</p>
            <ul style="margin:0 0 32px;padding-right:20px;color:#4a5568;font-size:14px;line-height:1.8;columns:2;">
              ${charList}
            </ul>

            <!-- Message -->
            <div style="background:#ebf4ff;border-right:4px solid #667eea;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
              <p style="margin:0;color:#434190;font-size:14px;line-height:1.7;">
                בימים הקרובים נעצב עבורכם את קלפי משחק הזיכרון האישי.<br />
                נשלח אליכם עדכון כשהמשחק יהיה מוכן לשליחה.
              </p>
            </div>

            <p style="text-align:center;color:#a0aec0;font-size:13px;margin:0;">
              יש שאלות? נשמח לעזור — <a href="mailto:hello@memoreals.com" style="color:#667eea;">hello@memoreals.com</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#a0aec0;font-size:12px;">© 2026 MemoReals · כל הזכויות שמורות</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set, skipping email');
    return;
  }

  try {
    await resend.emails.send({
      from:    'MemoReals <onboarding@resend.dev>',
      to:      payload.to,
      subject: `✅ ההזמנה שלך התקבלה! — MemoReals`,
      html:    buildOrderEmailHtml(payload),
    });
    console.log('[email] Order confirmation sent to', payload.to);
  } catch (err) {
    // Don't throw — email failure should never block the order
    console.error('[email] Failed to send confirmation:', err);
  }
}
