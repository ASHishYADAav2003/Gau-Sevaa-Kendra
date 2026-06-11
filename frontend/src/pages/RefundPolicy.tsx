import { Helmet } from 'react-helmet-async';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Helmet title="Refund and Cancellation Policy | Gau Seva Kendra">
        <meta name="description" content="Review the Gau Seva Kendra donation refund, cancellation, and failed transaction policy." />
      </Helmet>
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund & Cancellation Policy</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            At Gau Seva Kendra, we deeply appreciate your compassionate support towards the welfare and protection of sacred cows. 
            Because all contributions are processed immediately and channeled directly into our charitable activities—such as 
            providing food, shelter, and medical care to rescued animals—we maintain a strict <strong>No Refund Policy</strong>.
          </p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. General Rule</h2>
          <p>
            All donations made through our online gateway, bank transfers, or in-person cash contributions are final and 
            cannot be refunded, cancelled, or reversed under any circumstances.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Technical Failures</h2>
          <p>
            If a transaction fails but money is debited from your account due to technical issues or network failures, 
            the amount is usually rolled back automatically by your bank or the payment gateway provider within 5 to 7 working days. 
            Gau Seva Kendra has no control over this process.
          </p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Accidental Donations</h2>
          <p>
            We urge all donors to exercise due care and diligence while making donations. Gau Seva Kendra does not oblige 
            requests for refunds of accidental donations or typos in donation amounts.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Contact</h2>
          <p>
            If you have questions regarding your transaction, tax receipt, or need clarification regarding this policy, 
            please contact us at <strong>info@gausevakendra.org</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
