'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { CatalogoOrderSchema, type CatalogoOrder } from '@/app/api/whatsapp/catalogo/schema';
import { type Product, clearBasket, getBasket, removeFromBasket } from '@/utils/basket';

export type InquiryStatus = 'idle' | 'sending' | 'sent';

const SUBMISSION_ERROR =
  'No pudimos enviar la consulta por WhatsApp. Tu selección y tu teléfono siguen acá.';

type ValidationResult =
  | { success: true; data: CatalogoOrder }
  | { success: false; field: 'phone' | 'form'; message: string };

function validateInquiry(phone: string, items: Product[] | null): ValidationResult {
  const result = CatalogoOrderSchema.safeParse({
    to: phone,
    items: items?.map((product) => product.name) ?? [],
  });

  if (result.success) return { success: true, data: result.data };

  const issue = result.error.issues[0];
  return {
    success: false,
    field: issue?.path[0] === 'to' ? 'phone' : 'form',
    message: issue?.message ?? 'Datos inválidos.',
  };
}

async function sendInquiry(payload: CatalogoOrder): Promise<void> {
  const response = await fetch('/api/whatsapp/catalogo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { ok?: boolean };

  if (!response.ok || !data.ok) {
    throw new Error('Catalog inquiry submission failed.');
  }
}

export function useBasketInquiry() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<InquiryStatus>('idle');
  const isSubmitting = useRef(false);

  useEffect(() => {
    const loadBasket = window.setTimeout(() => setItems(getBasket()), 0);
    return () => window.clearTimeout(loadBasket);
  }, []);

  function remove(id: string) {
    removeFromBasket(id);
    setItems((current) => current?.filter((product) => product.id !== id) ?? []);
  }

  function updatePhone(value: string) {
    setPhone(value);
    setPhoneError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting.current) return;

    setError('');
    setPhoneError('');

    const validation = validateInquiry(phone, items);
    if (!validation.success) {
      if (validation.field === 'phone') {
        setPhoneError(validation.message);
        document.getElementById('phone')?.focus();
      } else {
        setError(validation.message);
      }
      return;
    }

    isSubmitting.current = true;
    setStatus('sending');

    try {
      await sendInquiry(validation.data);
      clearBasket();
      setItems([]);
      setStatus('sent');
    } catch {
      setError(SUBMISSION_ERROR);
      setStatus('idle');
    } finally {
      isSubmitting.current = false;
    }
  }

  return { items, phone, phoneError, error, status, remove, updatePhone, handleSubmit };
}
