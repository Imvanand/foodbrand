"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) {
          setError(error.message);
        } else {
          setMessage('Registration Successful! Please check your email to verify.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
        } else {
          setMessage('Login Successful! Welcome back.');
          setTimeout(() => router.push('/'), 1500);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <img src="/logo/logo.png" alt="Kalsa Foods Logo" className={styles.brandLogo} />
          </Link>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>{isSignUp ? 'Create account' : 'Sign in'}</h1>
          
          <form className={styles.form} onSubmit={handleAuth}>
            {isSignUp && (
              <div className={styles.inputGroup}>
                <label htmlFor="fullName">Your name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="First and last name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder={isSignUp ? "At least 6 characters" : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.success}>{message}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : (isSignUp ? 'Verify email' : 'Continue')}
            </button>

            <p className={styles.notice}>
              By continuing, you agree to Kalsa Foods' <Link href="/terms_of_use">Conditions of Use</Link> and <Link href="/privacy_policy">Privacy Notice</Link>.
            </p>

            {!isSignUp && (
               <div className={styles.businessPrompt}>
                 <p>Buying for work?</p>
                 <Link href="/contact#bulk-order">Create a free business account</Link>
               </div>
            )}
          </form>

          {isSignUp ? (
            <div className={styles.toggleSection}>
                <div className={styles.divider}><span>Already have an account?</span></div>
                <button 
                type="button" 
                className={styles.secondaryBtn}
                onClick={() => { setIsSignUp(false); setError(''); setMessage(''); }}
                >
                Sign in
                </button>
            </div>
          ) : (
            <div className={styles.toggleSection}>
                <div className={styles.divider}><span>New to Kalsa Foods?</span></div>
                <button 
                type="button" 
                className={styles.secondaryBtn}
                onClick={() => { setIsSignUp(true); setError(''); setMessage(''); }}
                >
                Create your Kalsa Foods account
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
