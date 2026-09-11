import { faqs } from '@/app/contact/contact.data';
import styles from '@/app/contact/contact.module.scss';

export default function FaqSection() {
  return (
    <section className={styles.faqSection} aria-labelledby="faq-title">
      <div className={styles.faqHeader}>
        <h2 id="faq-title" className={styles.faqTitle}>
          Preguntas frecuentes
        </h2>
      </div>
      <div className={styles.faqList}>
        {faqs.map(({ question, answer }) => (
          <article key={question} className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>{question}</h3>
            <p className={styles.faqAnswer}>{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
