"""
Проверка 6-значного кода подтверждения.
Возвращает success:true если код верный и не истёк.
"""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip().lower()
    code = body.get('code', '').strip()

    if not all([phone, email, code]):
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Укажите телефон, email и код'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id FROM auth_codes
        WHERE phone = %s AND email = %s AND code = %s
          AND used = FALSE AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1
        """,
        (phone, email, code)
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Неверный или устаревший код'}),
        }

    # Помечаем код использованным
    cur.execute("UPDATE auth_codes SET used = TRUE WHERE id = %s", (row[0],))
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True}),
    }
