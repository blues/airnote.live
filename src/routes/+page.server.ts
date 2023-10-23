import { fail } from '@sveltejs/kit';
import {
  loginToNotehub,
  loginToOry,
  getProjects,
  createProject
} from '$lib/services/notehub';
import { compareAsc } from 'date-fns';

export async function load({ cookies }) {
  const user_token = await cookies.get('x-session-token');
  let notehub_projects;
  // fetch all the user's projects if they're logged in
  if (user_token !== undefined) {
    const allNotehubProjects = await getProjects(user_token).catch((err) => {
      console.error(err);
    });
    // sort all Notehub projects from oldest to newest
    const sortedNotehubProjects = allNotehubProjects.projects.sort((a, b) =>
      compareAsc(new Date(a.created), new Date(b.created))
    );
    notehub_projects = sortedNotehubProjects
      .map((project) => {
        return {
          uid: project.uid,
          label: project.label,
          created: project.created,
          role: project.role
        };
      })
      .sort((a, b) => {
        a.created - b.created;
      });
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
    console.log('Login res ', response);
    cookies.set('x-session-token', response.session_token);
    return { success: true };
  },
  loginViaOry: async ({ request }) => {
    const body = await request.formData();
    const response = await loginToOry(
      body.get('email'),
      body.get('password')
    ).catch((err) => {
      console.error(err);
      return fail(500, { error: err });
    });
    console.log('Notehub API direct login response ', response);
  },
  createNotehubProject: async ({ cookies, request }) => {
    const user_token = await cookies.get('x-session-token');
    const body = await request.formData();
    const response = await createProject(
      user_token,
      body.get('project_name')
    ).catch((err) => {
      console.error(err);
      return fail(500, { error: err });
    });
    console.log('create proj res ', response);
    if (response.code === 401) {
      return fail(500, { error: response.status });
    } else {
      return {
        uid: response.uid,
        label: response.label,
        created: response.created,
        role: response.role
      };
    }
  }
};
