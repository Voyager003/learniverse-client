const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Assert API response is successful, throw descriptive error otherwise.
 */
async function assertOk(res: Response, context: string): Promise<Record<string, unknown>> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `[E2E Seed] ${context} failed (${res.status}): ${JSON.stringify(json.message ?? json)}`,
    );
  }
  return json;
}

/**
 * Register a user via backend API.
 */
export async function apiRegister(data: {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'tutor';
}): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await assertOk(res, `Register ${data.email}`);
  return json.data as AuthTokens;
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
  const json = await assertOk(res, `Login ${data.email}`);
  return json.data as AuthTokens;
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
  const json = await assertOk(res, `CreateCourse "${data.title}"`);
  return json.data as { id: string };
}

/**
 * Publish a course via backend API.
 */
export async function apiPublishCourse(
  token: string,
  courseId: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isPublished: true }),
  });
  await assertOk(res, `PublishCourse ${courseId}`);
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
  const json = await assertOk(res, `CreateLecture "${data.title}"`);
  return json.data as { id: string };
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
  const json = await assertOk(res, `Enroll course ${courseId}`);
  return json.data as { id: string };
}

/**
 * Create an assignment for a course via backend API.
 */
export async function apiCreateAssignment(
  token: string,
  courseId: string,
  data: { title: string; description: string; dueDate?: string },
): Promise<{ id: string; isPublished?: boolean }> {
  const res = await fetch(`${API_URL}/courses/${courseId}/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await assertOk(res, `CreateAssignment "${data.title}"`);
  return json.data as { id: string; isPublished?: boolean };
}

/**
 * Update assignment publish status via backend API.
 */
export async function apiPublishAssignment(
  token: string,
  courseId: string,
  assignmentId: string,
  isPublished = true,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/courses/${courseId}/assignments/${assignmentId}/publish`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublished }),
    },
  );
  await assertOk(
    res,
    `${isPublished ? 'Publish' : 'Unpublish'}Assignment ${assignmentId}`,
  );
}

/**
 * Submit an assignment as a student via backend API.
 */
export async function apiSubmitAssignment(
  token: string,
  assignmentId: string,
  data: { content: string },
): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await assertOk(res, `SubmitAssignment ${assignmentId}`);
  return json.data as { id: string };
}
