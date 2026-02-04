import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'How do I book an appointment?',
            answer: 'You can book an appointment through our website by clicking the "Book Appointment" button, calling our helpline, or visiting the hospital reception. Online booking is available 24/7 for your convenience.',
        },
        {
            question: 'Do you accept insurance?',
            answer: 'Yes, we accept most major health insurance plans. Please contact our billing department or check our website for a complete list of accepted insurance providers. We also offer cashless treatment for many insurance plans.',
        },
        {
            question: 'What are your emergency services hours?',
            answer: 'Our emergency department is open 24/7, 365 days a year. We have a dedicated emergency team always ready to provide immediate care for critical situations.',
        },
        {
            question: 'Can I get my medical reports online?',
            answer: 'Yes, all test results and medical reports are available through our patient portal. You will receive login credentials after your first visit. Reports are typically uploaded within 24-48 hours of testing.',
        },
        {
            question: 'Do you offer online consultations?',
            answer: 'Yes, we offer video consultations with our doctors for follow-up visits and non-emergency medical advice. You can book an online consultation through our website or mobile app.',
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept cash, credit/debit cards, UPI, net banking, and all major digital wallets. We also offer EMI options for expensive treatments and procedures.',
        },
        {
            question: 'Is parking available at the hospital?',
            answer: 'Yes, we have ample parking space available for patients and visitors. The first 2 hours of parking are complimentary. Valet parking service is also available.',
        },
        {
            question: 'What should I bring for my first visit?',
            answer: 'Please bring a valid ID proof, your insurance card (if applicable), any previous medical records, current medications list, and the referral letter if you have one.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <p className="section-subtitle">
                        Find answers to common questions about our services and facilities.
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="card overflow-hidden animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </h3>
                                <FiChevronDown
                                    className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-6 pt-2">
                                    <p className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 text-center glass rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Still have questions?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Our support team is here to help you 24/7
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="tel:+911234567890" className="btn-primary">
                            Call Us Now
                        </a>
                        <a href="mailto:info@clinixa.com" className="btn-outline">
                            Email Support
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
