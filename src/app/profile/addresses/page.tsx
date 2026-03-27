"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from './addresses.module.css';
import { Plus, X, Loader2, MapPin } from 'lucide-react';

export default function AddressesPage() {
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    pincode: '',
    flat_house: '',
    area_street: '',
    landmark: '',
    city: '',
    state: '',
    is_default: false
  });

  const fetchAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setAddresses(data);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await fetchAddresses(session.user.id);
      setLoading(false);
    };
    init();
  }, [router, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();

        if (data && data.address) {
          setFormData(prev => ({
            ...prev,
            pincode: data.address.postcode || prev.pincode,
            city: data.address.city || data.address.town || data.address.village || data.address.county || prev.city,
            state: data.address.state || prev.state,
            area_street: data.address.suburb || data.address.neighbourhood || data.address.road || prev.area_street,
          }));
        }
      } catch (err) {
        alert('Could not fetch location details automatically.');
      } finally {
        setIsLocating(false);
      }
    }, () => {
      alert('Please allow location access in your browser to use this feature.');
      setIsLocating(false);
    });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
        if (formData.is_default) {
            await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
        }

        let error;
        if (editingAddressId) {
            const { error: updateError } = await supabase
                .from('user_addresses')
                .update(formData)
                .eq('id', editingAddressId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('user_addresses')
                .insert([{ user_id: user.id, ...formData }]);
            error = insertError;
        }

        if (!error) {
            await fetchAddresses(user.id);
            closeModal();
        } else {
            alert("Error saving address: " + error?.message);
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setEditingAddressId(null);
    setFormData({ full_name: '', phone: '', pincode: '', flat_house: '', area_street: '', landmark: '', city: '', state: '', is_default: false });
    setIsModalOpen(true);
  };

  const openEditModal = (address: any) => {
    setEditingAddressId(address.id);
    setFormData({
      full_name: address.full_name || '',
      phone: address.phone || '',
      pincode: address.pincode || '',
      flat_house: address.flat_house || '',
      area_street: address.area_street || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      is_default: address.is_default || false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddressId(null);
    setFormData({ full_name: '', phone: '', pincode: '', flat_house: '', area_street: '', landmark: '', city: '', state: '', is_default: false });
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this address?')) {
        const { error } = await supabase.from('user_addresses').delete().eq('id', id);
        if (!error) {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
        }
    }
  };

  const handleSetDefault = async (id: string) => {
     if (isSubmitting) return;
     setIsSubmitting(true);
     try {
         await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
         await supabase.from('user_addresses').update({ is_default: true }).eq('id', id);
         await fetchAddresses(user.id);
     } finally {
         setIsSubmitting(false);
     }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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
          <Link href="/profile">Your Account</Link> › <span>Your Addresses</span>
        </div>
        
        <h1 className={styles.title}>Your Addresses</h1>
        
        <div className={styles.grid}>
          {/* Add Address Card */}
          <div className={styles.addCard} onClick={openAddModal}>
            <Plus size={48} className={styles.addIcon} strokeWidth={1} />
            <div className={styles.addText}>Add Address</div>
          </div>

          {/* Existing Addresses */}
          {addresses.map((address) => (
            <div className={styles.addressCard} key={address.id}>
              {address.is_default && <div className={styles.defaultBadge}>Default:</div>}
              <div className={styles.addressName}>{address.full_name}</div>
              <div className={styles.addressDetails}>
                {address.flat_house}, {address.area_street}<br />
                {address.landmark && <>{address.landmark}<br/></>}
                {address.city}, {address.state} {address.pincode}<br />
                India<br />
                Phone number: {address.phone}
              </div>
              <div className={styles.cardActions}>
                <button className={styles.actionLink} onClick={() => openEditModal(address)}>Edit</button>
                <button className={styles.actionLink} onClick={() => handleDelete(address.id)}>Remove</button>
                {!address.is_default && (
                  <button 
                    className={styles.actionLink} 
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isSubmitting}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeBtn} onClick={closeModal}>
                  <X size={24} color="#555" />
              </button>
              <h2 className={styles.modalTitle}>{editingAddressId ? 'Edit address' : 'Add a new address'}</h2>
              <form onSubmit={handleSaveAddress}>
                <button type="button" onClick={handleFetchLocation} disabled={isLocating} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#e3e6e6', border: '1px solid #d5d9d9', borderRadius: '8px', cursor: 'pointer', marginBottom: '15px', width: '100%', justifyContent: 'center', fontWeight: 'bold' }}>
                    {isLocating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} color="#007185" />}
                    {isLocating ? 'Locating...' : 'Use my current location'}
                </button>
                <div className={styles.formGroup}>
                  <label htmlFor="full_name">Full name (First and Last name)</label>
                  <input type="text" id="full_name" value={formData.full_name} onChange={handleInputChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Mobile number</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pincode">Pincode</label>
                  <input type="text" id="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="6 digits [0-9] PIN code" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="flat_house">Flat, House no., Building, Company, Apartment</label>
                  <input type="text" id="flat_house" value={formData.flat_house} onChange={handleInputChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="area_street">Area, Street, Sector, Village</label>
                  <input type="text" id="area_street" value={formData.area_street} onChange={handleInputChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="landmark">Landmark</label>
                  <input type="text" id="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="E.g. near apollo hospital" />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label htmlFor="city">Town/City</label>
                      <input type="text" id="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                      <label htmlFor="state">State</label>
                      <input type="text" id="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                </div>
                <div className={styles.checkboxGroup}>
                  <input type="checkbox" id="is_default" checked={formData.is_default} onChange={handleInputChange} />
                  <label htmlFor="is_default">Make this my default address</label>
                </div>

                <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingAddressId ? 'Save changes' : 'Add address')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
