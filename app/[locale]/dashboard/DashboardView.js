'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, Check, Lock, Database, Percent, LogOut, X } from 'lucide-react';
import styles from './DashboardView.module.css';

export default function DashboardView({ initialProducts }) {
  const t = useTranslations('dashboard');
  const common = useTranslations('common');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    nameAr: '',
    nameEn: '',
    taglineAr: '',
    taglineEn: '',
    price: '',
    size: '100ml / 3.4 FL. OZ.',
    concentration: 'Extrait de Parfum (30%)',
    discountPercent: 0,
    discountActive: false,
    image: '/images/products/oud-royale.jpg',
    descriptionAr: '',
    descriptionEn: '',
    scentCharacterAr: '',
    scentCharacterEn: '',
    topNotesAr: '',
    topNotesEn: '',
    heartNotesAr: '',
    heartNotesEn: '',
    baseNotesAr: '',
    baseNotesEn: '',
  });

  // Check session storage on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('influx_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('influx_admin_auth', 'true');
      } else {
        setAuthError(t('invalidPassword'));
      }
    } catch {
      setAuthError('Connection error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('influx_admin_auth');
  };

  // Open modal for add or edit
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `perfume-${Date.now()}`,
      nameAr: '',
      nameEn: '',
      taglineAr: '',
      taglineEn: '',
      price: '',
      size: '100ml / 3.4 FL. OZ.',
      concentration: 'Extrait de Parfum (30%)',
      discountPercent: 0,
      discountActive: false,
      image: '/images/products/oud-royale.jpg',
      descriptionAr: '',
      descriptionEn: '',
      scentCharacterAr: isAr ? 'خشبي / عنبري' : 'Woody / Amber',
      scentCharacterEn: 'Woody / Amber',
      topNotesAr: 'البرغموت, الهيل',
      topNotesEn: 'Bergamot, Cardamom',
      heartNotesAr: 'الورد, خشب الأرز',
      heartNotesEn: 'Rose, Cedarwood',
      baseNotesAr: 'الكهرمان, العود',
      baseNotesEn: 'Amber, Oud',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      topNotesAr: Array.isArray(product.topNotesAr) ? product.topNotesAr.join(', ') : product.topNotesAr || '',
      topNotesEn: Array.isArray(product.topNotesEn) ? product.topNotesEn.join(', ') : product.topNotesEn || '',
      heartNotesAr: Array.isArray(product.heartNotesAr) ? product.heartNotesAr.join(', ') : product.heartNotesAr || '',
      heartNotesEn: Array.isArray(product.heartNotesEn) ? product.heartNotesEn.join(', ') : product.heartNotesEn || '',
      baseNotesAr: Array.isArray(product.baseNotesAr) ? product.baseNotesAr.join(', ') : product.baseNotesAr || '',
      baseNotesEn: Array.isArray(product.baseNotesEn) ? product.baseNotesEn.join(', ') : product.baseNotesEn || '',
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isNew = !editingProduct;
      const res = await fetch('/api/products', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setProducts((prev) => [...prev, data.product]);
        } else {
          setProducts((prev) =>
            prev.map((p) => (p.id === data.product.id ? data.product : p))
          );
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick discount update directly from row
  const handleQuickDiscountUpdate = async (product, newPercent, newActive) => {
    const updated = {
      ...product,
      discountPercent: Number(newPercent),
      discountActive: Boolean(newActive),
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? updated : p))
    );

    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error('Failed to update discount:', e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('deleteConfirm'))) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className={styles.loginCard}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Lock size={32} color="var(--accent-burgundy)" />
        </div>
        <h2 className={styles.loginTitle}>{t('authTitle')}</h2>
        <p className={styles.loginSubtitle}>
          {isAr
            ? 'يرجى إدخال كلمة مرور الإدارة للوصول إلى لوحة التحكم'
            : 'Enter admin password to access the management portal'}
        </p>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          {authError && (
            <div style={{ color: 'var(--status-error)', fontSize: '0.8125rem' }}>
              {authError}
            </div>
          )}
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder={t('password')}
            className={styles.inputField}
            required
          />
          <Button type="submit" variant="burgundy" fullWidth size="md">
            {t('login')}
          </Button>
          <div className={styles.hintText}>
            كلمة المرور الافتراضية (Default password): <strong>influx2026</strong>
          </div>
        </form>
      </div>
    );
  }

  const activeDiscountsCount = products.filter(
    (p) => p.discountActive && p.discountPercent > 0
  ).length;

  return (
    <div className={styles.wrapper}>
      {/* Top Header */}
      <div className={styles.dashHeader}>
        <div className={styles.dashTitleArea}>
          <h1 className={styles.dashTitle}>{t('title')}</h1>
          <p className={styles.dashSubtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="burgundy" size="sm" onClick={openAddModal}>
            <Plus size={16} />
            {t('addProduct')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut size={16} />
            {t('logout')}
          </Button>
        </div>
      </div>

      {/* Supabase Readiness Notice */}
      <div className={styles.supabaseBanner}>
        <Database size={20} />
        <span>{t('supabaseNotice')}</span>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{products.length}</span>
          <span className={styles.statLabel}>إجمالي العطور (Fragrances)</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{activeDiscountsCount}</span>
          <span className={styles.statLabel}>عروض الخصم المفعلة (Active Discounts)</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>١٠٠٪</span>
          <span className={styles.statLabel}>جاهزية المنظومة (Ready for Supabase)</span>
        </div>
      </div>

      {/* Products List */}
      <div className={styles.productsList}>
        {products.map((product) => {
          const name = isAr ? product.nameAr : product.nameEn;
          const isDiscounted = product.discountActive && product.discountPercent > 0;
          const effectivePrice = isDiscounted
            ? Math.round(product.price * (1 - product.discountPercent / 100))
            : product.price;

          return (
            <div key={product.id} className={styles.productRow}>
              {/* Thumbnail */}
              <div className={styles.thumbWrapper}>
                <Image
                  src={product.image || '/images/products/oud-royale.jpg'}
                  alt={name}
                  fill
                  sizes="80px"
                  className={styles.thumbImg}
                />
              </div>

              {/* Info */}
              <div className={styles.infoBlock}>
                <h3 className={styles.prodName}>{name}</h3>
                <span className={styles.prodMeta}>
                  {product.concentration} • {product.size}
                </span>
                <span className={styles.prodPrice}>
                  {effectivePrice} {common('currency')}
                  {isDiscounted && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginInlineStart: '8px', fontSize: '0.8125rem' }}>
                      {product.price} {common('currency')}
                    </span>
                  )}
                </span>
              </div>

              {/* Discount Controls (As requested by user) */}
              <div className={styles.discountBlock}>
                <span className={styles.discountTitle}>
                  <Percent size={12} style={{ display: 'inline', marginInlineEnd: 4 }} />
                  {t('discountPercent')}
                </span>

                <div className={styles.discountControls}>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={product.discountPercent || 0}
                    onChange={(e) =>
                      handleQuickDiscountUpdate(
                        product,
                        e.target.value,
                        product.discountActive
                      )
                    }
                    className={styles.discountInput}
                  />
                  <span>%</span>

                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={Boolean(product.discountActive)}
                      onChange={(e) =>
                        handleQuickDiscountUpdate(
                          product,
                          product.discountPercent,
                          e.target.checked
                        )
                      }
                      style={{ accentColor: 'var(--accent-burgundy)' }}
                    />
                    <span>{t('discountActive')}</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionsBlock}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(product)}
                >
                  <Edit2 size={14} />
                  {t('editProduct')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  style={{ color: 'var(--status-error)' }}
                >
                  <Trash2 size={14} />
                  {t('deleteProduct')}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingProduct ? t('editProduct') : t('addProduct')}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('productNameAr')}</label>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleFormChange}
                  className={styles.inputField}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('productNameEn')}</label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleFormChange}
                  className={styles.inputField}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('price')}</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className={styles.inputField}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('size')}</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleFormChange}
                  className={styles.inputField}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('concentration')}</label>
                <input
                  type="text"
                  name="concentration"
                  value={formData.concentration}
                  onChange={handleFormChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('image')}</label>
                <select
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  className={styles.inputField}
                >
                  <option value="/images/products/oud-royale.jpg">Oud Royale Image</option>
                  <option value="/images/products/cedar-mist.jpg">Cedar Mist Image</option>
                  <option value="/images/products/noir-essence.jpg">Noir Essence Image</option>
                  <option value="/images/products/velvet-garden.jpg">Velvet Garden Image</option>
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label className={styles.formLabel}>{t('descriptionAr')}</label>
                <textarea
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleFormChange}
                  className={styles.inputField}
                  rows={3}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullCol}`}>
                <label className={styles.formLabel}>{t('descriptionEn')}</label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleFormChange}
                  className={styles.inputField}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('topNotesAr')}</label>
                <input
                  type="text"
                  name="topNotesAr"
                  value={formData.topNotesAr}
                  onChange={handleFormChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('heartNotesAr')}</label>
                <input
                  type="text"
                  name="heartNotesAr"
                  value={formData.heartNotesAr}
                  onChange={handleFormChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('baseNotesAr')}</label>
                <input
                  type="text"
                  name="baseNotesAr"
                  value={formData.baseNotesAr}
                  onChange={handleFormChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.modalFooter + ' ' + styles.fullCol}>
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="burgundy"
                  size="md"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? common('loading') : t('save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
