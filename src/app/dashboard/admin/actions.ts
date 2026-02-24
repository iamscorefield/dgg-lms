'use server';

import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase-server';

export async function approveTutor(applicationId: string, userId: string) {
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

  await supabase
    .from('tutor_applications')
    .update({ status: 'approved' })
    .eq('id', applicationId);

  await supabase
    .from('profiles')
    .update({ role: 'tutor' })
    .eq('id', userId);

  redirect('/dashboard/admin');
}

export async function rejectTutor(applicationId: string) {
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

  await supabase
    .from('tutor_applications')
    .update({ status: 'rejected' })
    .eq('id', applicationId);

  redirect('/dashboard/admin');
}
