import { NextResponse } from 'next/server';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  public_metadata: {
    role: string;
  };
}
const expirationDate = new Date(Date.now() + 60 * 1000); // 1 минута

export async function GET(request: Request): Promise<NextResponse> {
  const clerkApiToken = 'sk_test_vj76VrZLgCkWVRJ1UtJBr9tpWMmTV7KR4Ijq0XX33q';

  // Обновляем public_metadata для всех пользователей
  await updateAllUsersUnsafeMetadata(clerkApiToken);

  // Получаем список пользователей, используя запрос с параметром Cache-Control
  const response = await fetch('https://api.clerk.dev/v1/users?page=1&per_page=10&t=${Date.now()}', {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Authorization': `Bearer ${clerkApiToken}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: response.status });
  }

  const users: User[] = await response.json();

  // Добавляем public_metadata, если оно отсутствует
  for (const user of users) {
    if (!user.public_metadata) {
      user.public_metadata = { role: 'Пользователь' };
    }
  }

  return NextResponse.json(users);
}

async function updateAllUsersUnsafeMetadata(clerkApiToken: string): Promise<void> {
  let page = 1;
  let hasMoreUsers = true;

  while (hasMoreUsers) {
    const response = await fetch(`https://api.clerk.dev/v1/users?page=${page}&per_page=10&t=${Date.now()} `, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Authorization': `Bearer ${clerkApiToken}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching users:', error);
      return;
    }

    const users: User[] = await response.json();

    for (const user of users) {
      if (!user.public_metadata || !user.public_metadata.role) {
        await updateUserUnsafeMetadata(user.id, clerkApiToken);
      }
    }

    if (users.length < 20) {
      hasMoreUsers = false;
    } else {
      page++;
    }
  }
}

async function updateUserUnsafeMetadata(userId: string, clerkApiToken: string): Promise<void> {
  const response = await fetch(`https://api.clerk.dev/v1/users/${userId}&t=${Date.now()}`, {
    method: 'PATCH',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Authorization': `Bearer ${clerkApiToken}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      public_metadata: {
        role: 'Пользователь'
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`Error updating  public_metadata for user ${userId}:`, error);
  }
}