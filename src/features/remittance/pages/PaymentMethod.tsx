// src/features/remittance/components/PaymentMethods.tsx
import React, { useState } from "react";
import {
  Building2,
  CreditCard,
  Wallet,
  ChevronDown,
  ChevronUp,
  Info,

} from "lucide-react";

const PaymentMethods = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
    setExpandedFaqs({}); // Reset FAQs when switching cards
  };

  const toggleFaq = (cardId: string, faqIndex: number) => {
    const key = `${cardId}-${faqIndex}`;
    setExpandedFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const paymentMethods = [
    {
      id: "bank-deposit",
      title: "Bank Deposit",
      icon: Building2,
      shortDescription:
        "Pay for your transfer using bank transfer. Secure and reliable.",
      description: `A bank transfer is an electronic payment, which enables you to send money directly from your bank account to another bank account. With WorldRemit you can send money from your bank account to your family or friends' bank accounts all over the world.`,
      faqs: [
        {
          question: "How do I make an international bank transfer?",
          answer: `It's so easy to make international bank transfers using our website or app. Just follow these simple steps:

• Login or sign up for a WorldRemit account (it takes just 2 minutes to create an account)
• Select the country and amount you want to send
• Enter your recipient's details (name, address, phone number) and bank details (bank name, IBAN number and SWIFT code)
• Pay for your transaction`,
        },
        {
          question: "How long do international bank transfers take?",
          answer:
            "The time it takes varies depending on where you're sending money to. It could be instant or it could take 1 - 2 working days.",
        },
        {
          question: "How much does an international bank transfer cost?",
          answer:
            "The fees for sending a bank transfer to your loved ones will depend on the country you're sending to. But we're delighted to say that we won't charge any fees on your very first transfer with us.",
        },
        {
          question: "What is a BIC or Swift code?",
          answer:
            "The Bank Identifier Code (BIC) or SWIFT code is used in many countries around the world to identify the country, bank and branch that a bank account is registered to. The code is either 8 or 11 digits long and includes both numbers and letters.",
        },
        {
          question: "What is an IBAN?",
          answer:
            "An International Bank Account Number (IBAN) identifies an individual account (country, bank, branch and account number) in an individual transaction. It's up to 34 characters long and will include both numbers and letters.",
        },
      ],
    },
    {
      id: "debit-card",
      title: "Debit Card",
      icon: CreditCard,
      shortDescription:
        "Paying with Debit Card is quick and easy. It's also cheaper than a credit card.",
      description:
        "Send money instantly using your debit card. Fast, secure, and convenient for international transfers.",
      faqs: [
        {
          question: "What card types are accepted?",
          answer:
            "WorldRemit can accept most types of debit, credit and pre-paid cards that are issued by Visa or Mastercard. At this time WorldRemit cannot accept cards from Amex, Diner's Card, or Union Pay.",
        },
        {
          question: "Why was my card declined?",
          answer:
            "If your card declines, the best thing to do is to contact your card issuer's payments or authorisation department who will be able to give you more information.",
        },
        {
          question: "Are there any extra fees for paying by card?",
          answer:
            "When paying by debit card there are usually no extra fees other than those stated at the time you make payment. However, if you use a card issued in a country other than that which you are registered, your card issuer may charge a foreign exchange fee.",
        },
        {
          question: "How long does a card refund take?",
          answer:
            "Once cancellation has been confirmed, a refund will be credited within 7 working days. This can vary, however, if you are using a pre-paid card.",
        },
      ],
    },
    {
      id: "credit-card",
      title: "Credit Card",
      icon: Wallet,
      shortDescription:
        "Credit card issuers may charge an advance payment fee. Check with your issuer for details.",
      description:
        "Use your credit card for international transfers. Note that credit card issuers may charge an advance payment fee, which may affect the received amount.",
      faqs: [
        {
          question: "What card types are accepted?",
          answer:
            "WorldRemit can accept most types of debit, credit and pre-paid cards that are issued by Visa or Mastercard. At this time WorldRemit cannot accept cards from Amex, Diner's Card, or Union Pay.",
        },
        {
          question: "Are there any extra fees for paying by card?",
          answer:
            "Some credit card issuers may charge a fee as the transaction is classed as a cash transfer. The fee, if any, will depend upon your individual card terms and conditions and is not charged by WorldRemit.",
        },
        {
          question: "Can I pay using someone else's card?",
          answer:
            "We need the money you send to come from your own card. As a financially regulated company we need to ensure we know the identity of our customers – and this includes the source of the funds they pay with.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Payment Methods for International Transfers
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            We offer you a choice of ways to pay for your money transfers. But
            the choice will depend on where you're sending your money from.
            Please remember, that credit card payments may incur a fee from your
            credit card issuer, which may affect the received amount.
          </p>
          <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300">
            Click on any payment method below to learn more about how it works,
            fees, transfer times, and frequently asked questions.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isExpanded = expandedCard === method.id;

            return (
              <div
                key={method.id}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => toggleCard(method.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {method.title}
                        </h3>
                        <p className="text-gray-400">
                          {method.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="text-yellow-500">
                      {isExpanded ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-700 p-6 bg-gray-900/50">
                    {/* Main Description */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        About {method.title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">
                        {method.description}
                      </p>
                    </div>

                    {/* FAQs */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Frequently Asked Questions
                      </h4>

                      <div className="space-y-3">
                        {method.faqs.map((faq, index) => {
                          const faqKey = `${method.id}-${index}`;
                          const isFaqExpanded = expandedFaqs[faqKey];

                          return (
                            <div
                              key={index}
                              className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
                            >
                              {/* FAQ Question */}
                              <button
                                onClick={() => toggleFaq(method.id, index)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors"
                              >
                                <span className="text-white font-medium pr-8">
                                  {faq.question}
                                </span>
                                {isFaqExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                )}
                              </button>

                              {/* FAQ Answer */}
                              {isFaqExpanded && (
                                <div className="px-4 py-3 border-t border-gray-700">
                                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Have more questions? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
