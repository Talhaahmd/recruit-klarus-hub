import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does Klarus HR improve hiring speed?',
    a: 'Klarus HR automates sourcing, screening, and communication with AI, while streamlining interviews and follow-ups—leading to faster decisions and reduced time-to-hire.'
  },
  {
    q: 'Can I integrate Klarus HR with my ATS and calendar?',
    a: 'Yes. Klarus HR integrates with ATS systems, email providers, and calendars to sync candidates, events, and communication across your stack.'
  },
  {
    q: 'Does Klarus HR work for both individual recruiters and teams?',
    a: 'Absolutely. Klarus HR supports solo recruiters and teams with roles, permissions, and pipelines for collaboration.'
  },
  {
    q: 'Is there a free trial? Do I need a credit card?',
    a: 'We offer a 14-day free trial and you do not need a credit card to get started.'
  }
];

const FAQItem = ({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) => (
  <div className="border border-border rounded-xl overflow-hidden bg-card">
    <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-5 text-left group">
      <span className="text-foreground font-semibold">{q}</span>
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-muted-foreground">
        <ChevronDown className="w-5 h-5" />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="px-6 pb-5 text-muted-foreground"
        >
          {a}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="resources" className="py-20 lg:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Frequently asked questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about Klarus HR</p>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;


