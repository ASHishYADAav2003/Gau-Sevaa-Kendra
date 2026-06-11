import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Helmet title="Privacy Policy | Gau Seva Kendra">
        <meta name="description" content="Learn how Gau Seva Kendra collects, uses, protects, and shares donor and visitor information." />
      </Helmet>
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Gau Seva Kendra ("we," "our," or "us") is committed to protecting the privacy and security of our donors and users. 
            This Privacy Policy explains how we collect, use, and safeguard your personal data in accordance with applicable 
            data protection laws.
          </p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Identification Data:</strong> Full name, phone number, email address.</li>
            <li><strong>Financial Data:</strong> Donation amount, transaction references, and payment mode (Note: We do not store raw credit card numbers or banking passwords; these are handled securely by Razorpay).</li>
            <li><strong>Tax Data:</strong> PAN card details (if provided for 80G tax exemption receipts).</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Data</h2>
          <p>We use your data solely for charitable and operational purposes, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processing your donations and issuing 80G tax receipts.</li>
            <li>Sending you updates regarding the campaigns or animals you have supported.</li>
            <li>Maintaining internal ledgers to comply with trust laws and government regulations.</li>
          </ul>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security and Access Control</h2>
          <p>
            We treat your personal data with the utmost sensitivity. Access to donor data is restricted strictly to authorized 
            administrators of Gau Seva Kendra. We use secure databases, regular backups, and encrypted connections to prevent 
            unauthorized access, alteration, or data breaches.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Sharing</h2>
          <p>
            We will never sell, rent, or trade your personal data. Your data may only be shared with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment gateways (like Razorpay) solely for processing transactions.</li>
            <li>Government or statutory authorities when legally mandated for tax compliance and audits.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
