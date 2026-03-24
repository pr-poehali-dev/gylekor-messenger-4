"""
Отправка 6-значного кода подтверждения на email пользователя.
Сохраняет код в БД, удаляет старые коды для этого телефона/email.
"""
import json
import os
import random
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip().lower()

    if not phone or not email:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Укажите телефон и email'}),
        }

    if '@' not in email or '.' not in email:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Некорректный email'}),
        }

    code = str(random.randint(100000, 999999))

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # Удаляем старые неиспользованные коды
    cur.execute(
        "DELETE FROM auth_codes WHERE (phone = %s OR email = %s) AND used = FALSE",
        (phone, email)
    )

    # Сохраняем новый код
    cur.execute(
        "INSERT INTO auth_codes (phone, email, code) VALUES (%s, %s, %s)",
        (phone, email, code)
    )
    conn.commit()
    cur.close()
    conn.close()

    # Отправляем email
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    if not all([smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'SMTP не настроен'}),
        }

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Ваш код Гылекор: {code}'
    msg['From'] = f'Гылекор <{smtp_user}>'
    msg['To'] = email

    html = f"""
    <html>
    <body style="margin:0;padding:0;background:#0e1117;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:420px;margin:40px auto;background:#141820;border-radius:20px;overflow:hidden;border:1px solid #2a3347;">
        <div style="background:#3dba6e;padding:30px;text-align:center;">
          <div style="background:rgba(255,255,255,0.15);border-radius:16px;display:inline-block;padding:12px 20px;">
            <span style="color:#fff;font-size:22px;font-weight:700;letter-spacing:1px;">● Гылекор</span>
          </div>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#e8eaf0;font-size:20px;margin:0 0 8px;">Код подтверждения</h2>
          <p style="color:#8892a4;font-size:14px;margin:0 0 28px;">Введите этот код в мессенджере Гылекор</p>
          <div style="background:#1e2535;border:2px solid #3dba6e;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="color:#3dba6e;font-size:42px;font-weight:700;letter-spacing:12px;font-family:monospace;">{code}</span>
          </div>
          <p style="color:#4a5568;font-size:12px;text-align:center;margin:0;">Код действителен 10 минут.<br>Если вы не запрашивали код — проигнорируйте это письмо.</p>
        </div>
      </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, 'html'))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(smtp_user, email, msg.as_string())
    server.quit()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True, 'message': f'Код отправлен на {email}'}),
    }
