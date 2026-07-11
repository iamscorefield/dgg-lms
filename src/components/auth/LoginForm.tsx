'use client';

import { useState } from 'react';
import { createBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createBrowser();

    // 1. Authenticate primary credentials (Email + Password)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    try {
      // 2. 🛡️ MFA ASSURANCE INTERCEPTOR
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      // 🔍 DGG SECURITY DEBUG ENGINE
      console.log("--- DGG SECURITY DEBUG ---");
      console.log("MFA Data Matrix:", mfaData);
      console.log("MFA System Error:", mfaError);

      if (mfaError) throw mfaError;

      if (mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel !== 'aal2') {
        // User has verified Google Authenticator active! Route to verification prompt page.
        toast.success('Two-factor verification required.');
        router.push('/verify-mfa');
        return;
      }

      // 3. Baseline Success Fallback if no verified MFA configuration is active
      toast.success('Logged in successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (mfaCatchErr: any) {
      console.error('MFA assurance verification error:', mfaCatchErr);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label className="block text-lg font-bold text-[#512d7c] mb-2 text-left">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
        />
      </div>

      <div>
        <label className="block text-lg font-bold text-[#512d7c] mb-2 text-left">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-[#f2b42c] text-black text-xl font-bold rounded-full shadow-lg hover:bg-[#e0a51a] cursor-pointer border-0"
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}