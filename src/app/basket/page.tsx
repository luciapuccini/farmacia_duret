'use client';

import { useBasketInquiry } from './basketInquiry';
import { EmptyBasket, LoadingBasket, SentInquiry } from './components/BasketStates';
import ConsultationGuide from './components/ConsultationGuide';
import Heading from './components/Heading';
import MobileSubmitAction from './components/MobileSubmitAction';
import SelectedProducts from './components/SelectedProducts';

export default function BasketPage() {
  const { items, phone, phoneError, error, status, remove, updatePhone, handleSubmit } =
    useBasketInquiry();

  return (
    <main className="relative py-2 md:py-4">
      <Heading />

      {items === null ? (
        <LoadingBasket />
      ) : status === 'sent' ? (
        <SentInquiry />
      ) : items.length === 0 ? (
        <EmptyBasket />
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit}
          aria-busy={status === 'sending'}
          className="grid items-start gap-6 pb-[calc(9rem+env(safe-area-inset-bottom))] md:pb-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)] lg:gap-8"
        >
          <SelectedProducts items={items} onRemove={remove} />
          <ConsultationGuide
            itemCount={items.length}
            phone={phone}
            phoneError={phoneError}
            error={error}
            status={status}
            onPhoneChange={updatePhone}
          />
          <MobileSubmitAction error={error} status={status} />

          <span role="status" className="sr-only">
            {status === 'sending' ? 'Enviando consulta por WhatsApp.' : ''}
          </span>
        </form>
      )}
    </main>
  );
}
