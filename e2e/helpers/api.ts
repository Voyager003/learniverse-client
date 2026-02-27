const API_URL = 'http://localhost:3000/api/v1';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a user via backend API.
 */
export async function apiRegister(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

/**
 * Login via backend API.
 */
export async function apiLogin(data: {
  email: string;
  password: string;
}): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

/**
 * Promote user to tutor role via direct DB query.
 */
export async function promoteToTutor(email: string): Promise<void> {
  const { execSync } = await import('child_process');
  const sql = `UPDATE users SET role = 'tutor' WHERE email = '${email}';`;
  execSync(
    'docker exec -i learniverse-postgres-1 psql -U postgres -d learniverse',
    { input: sql },
  );
}

/**
 * Create a course via backend API.
 */
export async function apiCreateCourse(
  token: string,
  data: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
  },
): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

/**
 * Publish a course via backend API.
 */
export async function apiPublishCourse(
  token: string,
  courseId: string,
): Promise<void> {
  await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isPublished: true }),
  });
}

/**
 * Create a lecture for a course via backend API.
 */
export async function apiCreateLecture(
  token: string,
  courseId: string,
  data: { title: string; content: string; order: number },
): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/courses/${courseId}/lectures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

/**
 * Enroll a student in a course via backend API.
 */
export async function apiEnroll(
  token: string,
  courseId: string,
): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
  const json = await res.json();
  return json.data;
}
