import { fail } from '@sveltejs/kit';
import { loginToNotehub, loginToOry, getProjects } from '$lib/services/notehub';

export async function load({ cookies }) {
  const user_token = await cookies.get('x-session-token');
  let notehub_projects;
  // fetch all the user's projects if they're logged in
  if (user_token !== undefined) {
    const allNotehubProjects = await getProjects(user_token).catch((err) => {
      console.error(err);
    });
    notehub_projects = allNotehubProjects.projects.map((project) => {
      return {
        uid: project.uid,
        label: project.label,
        created: project.created,
        role: project.role
      };
    });
    console.log(notehub_projects.length);
  }
  return { user_token, notehub_projects };
}
export const actions = {
  // these two logins return the same thing: an x-session-token
  loginViaNotehubJs: async ({ cookies, request }) => {
    const body = await request.formData();
    const response = await loginToNotehub(
      body.get('email'),
      body.get('password')
    ).catch((err) => {
      console.error(err);
      return fail(500, { error: err });
    });
    console.log(response);
    cookies.set('x-session-token', response.session_token);
    return { success: true };
  },
  loginViaOry: async ({ cookies, request }) => {
    const body = await request.formData();
    const response = await loginToOry(
      body.get('email'),
      body.get('password')
    ).catch((err) => {
      console.error(err);
      return fail(500, { error: err });
    });
    console.log('ory response ', response);
  }
};
