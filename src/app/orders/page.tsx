'use client';

import { useState } from 'react';
import { PhoneSchema, REQUIRED_PHONE_MESSAGE } from '@/utils/phone';
import { getOrderCount, MAX_ORDERS_PER_DAY, recordOrder } from '@/utils/ordersRateLimit';
import LimitPanel from './components/LimitPanel/LimitPanel';
import OrderForm, { type Status } from './components/OrderForm/OrderForm';
import SentPanel from './components/SentPanel/SentPanel';

export default function ReservasPage() {
  const [charCount, setCharCount] = useState(0);
  const [consent, setConsent] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submissionCount, setSubmissionCount] = useState(getOrderCount);
  const [status, setStatus] = useState<Status>('idle');

  const remaining = MAX_ORDERS_PER_DAY - submissionCount;
  const isLimited = remaining <= 0;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLimited || !consent || status === 'submitting') {
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — silently accept
    if (fd.get('bot-field')) return;

    setErrorMessage('');
    setPhoneError('');

    const rawPhone = fd.get('phone');
    const phoneResult = PhoneSchema.safeParse(typeof rawPhone === 'string' ? rawPhone : '');

    if (!phoneResult.success) {
      setPhoneError(phoneResult.error.issues[0]?.message ?? REQUIRED_PHONE_MESSAGE);
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/whatsapp/orders', {
        method: 'POST',
        body: fd,
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error || 'No pudimos enviar el encargo.');
      }

      setSubmissionCount(recordOrder());
      setStatus('sent');
      form.reset();
      setCharCount(0);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'No pudimos enviar el encargo. Intentá de nuevo.',
      );
    }
  }

  function resetForm() {
    setCharCount(0);
    setErrorMessage('');
    setPhoneError('');
    setStatus('idle');
  }

  if (status === 'sent') {
    return <SentPanel onReset={() => setStatus('idle')} />;
  }

  if (isLimited) {
    return <LimitPanel />;
  }

  return (
    <OrderForm
      charCount={charCount}
      consent={consent}
      errorMessage={errorMessage}
      onReset={resetForm}
      onSubmit={handleSubmit}
      phoneError={phoneError}
      remaining={remaining}
      setCharCount={setCharCount}
      setConsent={setConsent}
      status={status}
    />
  );
}
