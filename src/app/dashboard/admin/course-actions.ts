'use server';

import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase-server';

async function requireAdmin() {
  const supabase = await createServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return supabase;
}

export async function deleteCourse(courseId: number) {
  const supabase = await requireAdmin();

  await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  redirect('/dashboard/admin');
}
