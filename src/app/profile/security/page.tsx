"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ShieldCheck, User, Mail, Smartphone, Loader2 } from 'lucide-react';
import styles from './security.module.css';

export default function SecurityPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const startEdit = (field: string, currentValue: string) => {
      setEditingField(field);
      setEditValue(currentValue);
  };

  const handleSave = async (field: string) => {
      setIsSaving(true);
      try {
          if (field === 'name') {
              const { error } = await supabase.auth.updateUser({ data: { full_name: editValue } });
              if (error) throw error;
              setUser((prev: any) => ({...prev, user_metadata: { ...prev.user_metadata, full_name: editValue }}));
              alert('Name updated successfully!');
          } else if (field === 'email') {
              const { error } = await supabase.auth.updateUser({ email: editValue });
              if (error) throw error;
              alert('Confirmation link sent to your new email. Please verify from both old and new email addresses if required.');
          } else if (field === 'password') {
              const { error } = await supabase.auth.updateUser({ password: editValue });
              if (error) throw error;
              alert('Password updated successfully!');
          } else if (field === 'phone') {
              const { error } = await supabase.auth.updateUser({ data: { phone: editValue } });
              if (error) throw error;
              setUser((prev: any) => ({...prev, user_metadata: { ...prev.user_metadata, phone: editValue }}));
              alert('Mobile number updated successfully!');
          }
          setEditingField(null);
      } catch (err: any) {
          alert('Error: ' + err.message);
      }
      setIsSaving(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

  if (loading) return (
    <>
      <Navbar />
      <div style={{ padding: '80px', textAlign: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="#224b33" />
      </div>
      <Footer />
    </>
  );

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
            <Link href="/profile">Your Account</Link> › <span className={styles.current}>Login & security</span>
        </div>

        <h1 className={styles.title}>Login & security</h1>

        <div className={styles.securityBox}>
            {/* Name */}
            <div className={styles.row}>
                <div className={styles.info}>
                    <div className={styles.label}>Name:</div>
                    {editingField === 'name' ? (
                        <div style={{marginTop: '10px'}}>
                            <input autoFocus type="text" style={{padding:'8px', width:'100%', maxWidth:'300px', border:'1px solid #d5d9d9', borderRadius:'4px', marginBottom:'10px'}} value={editValue} onChange={e => setEditValue(e.target.value)} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <button onClick={() => handleSave('name')} disabled={isSaving} className={styles.editBtn}>{isSaving ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setEditingField(null)} disabled={isSaving} className={styles.editBtn}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.value}>{user.user_metadata?.full_name || 'Not set'}</div>
                    )}
                </div>
                {editingField !== 'name' && <button className={styles.editBtn} onClick={() => startEdit('name', user.user_metadata?.full_name || '')}>Edit</button>}
            </div>

            {/* Email */}
            <div className={styles.row}>
                <div className={styles.info}>
                    <div className={styles.label}>Email:</div>
                    {editingField === 'email' ? (
                        <div style={{marginTop: '10px'}}>
                            <input autoFocus type="email" style={{padding:'8px', width:'100%', maxWidth:'300px', border:'1px solid #d5d9d9', borderRadius:'4px', marginBottom:'10px'}} value={editValue} onChange={e => setEditValue(e.target.value)} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <button onClick={() => handleSave('email')} disabled={isSaving} className={styles.editBtn}>{isSaving ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setEditingField(null)} disabled={isSaving} className={styles.editBtn}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.value}>{user.email}</div>
                    )}
                </div>
                {editingField !== 'email' && <button className={styles.editBtn} onClick={() => startEdit('email', user.email)}>Edit</button>}
            </div>

            {/* Phone */}
            <div className={styles.row}>
                <div className={styles.info}>
                    <div className={styles.label}>Primary mobile number:</div>
                    {editingField === 'phone' ? (
                        <div style={{marginTop: '10px'}}>
                            <input autoFocus type="tel" placeholder="Enter your 10 digit number" style={{padding:'8px', width:'100%', maxWidth:'300px', border:'1px solid #d5d9d9', borderRadius:'4px', marginBottom:'10px'}} value={editValue} onChange={e => setEditValue(e.target.value)} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <button onClick={() => handleSave('phone')} disabled={isSaving} className={styles.editBtn}>{isSaving ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setEditingField(null)} disabled={isSaving} className={styles.editBtn}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.value}>{user.user_metadata?.phone || '+91 Not linked'}</div>
                    )}
                </div>
                {editingField !== 'phone' && <button className={styles.editBtn} onClick={() => startEdit('phone', user.user_metadata?.phone || '')}>{user.user_metadata?.phone ? 'Edit' : 'Add'}</button>}
            </div>

            {/* Password */}
            <div className={styles.row}>
                <div className={styles.info}>
                    <div className={styles.label}>Password:</div>
                    {editingField === 'password' ? (
                        <div style={{marginTop: '10px'}}>
                            <input autoFocus type="password" placeholder="Enter new password" style={{padding:'8px', width:'100%', maxWidth:'300px', border:'1px solid #d5d9d9', borderRadius:'4px', marginBottom:'10px'}} value={editValue} onChange={e => setEditValue(e.target.value)} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <button onClick={() => handleSave('password')} disabled={isSaving} className={styles.editBtn}>{isSaving ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setEditingField(null)} disabled={isSaving} className={styles.editBtn}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.value}>********</div>
                    )}
                </div>
                {editingField !== 'password' && <button className={styles.editBtn} onClick={() => startEdit('password', '')}>Edit</button>}
            </div>
        </div>

        <div style={{ marginTop: '20px' }}>
            <Link href="/profile" className={styles.doneBtn}>Done</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
