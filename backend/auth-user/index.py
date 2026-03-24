"""
Регистрация нового пользователя или вход существующего после верификации кода.
Проверяет уникальность телефона, email и username.
Возвращает данные пользователя.
"""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # GET /check-phone?phone=... — проверка существует ли аккаунт
    if event.get('httpMethod') == 'GET':
        params = event.get('queryStringParameters') or {}
        phone = params.get('phone', '').strip()
        email = params.get('email', '').strip().lower()

        if phone:
            cur.execute("SELECT id, name, username, phone, email, bio FROM users WHERE phone = %s", (phone,))
            row = cur.fetchone()
            cur.close()
            conn.close()
            if row:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'exists': True,
                        'user': {
                            'id': str(row[0]),
                            'name': row[1],
                            'username': row[2],
                            'phone': row[3],
                            'email': row[4],
                            'bio': row[5] or '',
                        }
                    }),
                }
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'exists': False})}

        if email:
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'exists': bool(row)})}

        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажите phone или email'})}

    # POST — регистрация нового пользователя
    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    username = body.get('username', '').strip().lower()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip().lower()
    bio = body.get('bio', '').strip()

    if not all([name, username, phone, email]):
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

    # Проверяем уникальность
    cur.execute("SELECT id FROM users WHERE phone = %s", (phone,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'error': 'Аккаунт с таким номером уже существует'})}

    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'error': 'Аккаунт с таким email уже существует'})}

    cur.execute("SELECT id FROM users WHERE username = %s", (username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'error': f'@{username} уже занят, выберите другой'})}

    # Создаём пользователя
    cur.execute(
        "INSERT INTO users (name, username, phone, email, bio) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (name, username, phone, email, bio)
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'success': True,
            'user': {
                'id': str(user_id),
                'name': name,
                'username': username,
                'phone': phone,
                'email': email,
                'bio': bio,
            }
        }),
    }
