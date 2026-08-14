import { useState } from 'react';
import { Input } from '../components/ui';

const ShippingRequest = () => {
  const [company, setCompany] = useState('');
  const [sender, setSender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shipDate, setShipDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/create-shipping-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company,
          sender,
          email,
          phone,
          address,
          shipDate,
          deliveryDate,
        }),
      });

      const responseText = await response.text();

      let result: any;

      try {
        result = JSON.parse(responseText);
      } catch {
        console.error(
          'Non-JSON response received from server:',
          responseText
        );

        alert(
          'Server error:\n' +
            responseText.substring(0, 300)
        );

        return;
      }

      if (!response.ok) {
        console.error('Salesforce API error:', result);

        let errorMessage = result?.error || 'Unknown Salesforce error';

        if (result?.details) {
          errorMessage +=
            '\n\nDetails:\n' +
            JSON.stringify(result.details, null, 2);
        }

        alert('Salesforce error:\n' + errorMessage);

        return;
      }

      console.log('Salesforce record created:', result);

      alert(
        `Shipping request created successfully!\n\nSalesforce Record ID: ${result.id}`
      );

      // Clear form
      setCompany('');
      setSender('');
      setEmail('');
      setPhone('');
      setAddress('');
      setShipDate('');
      setDeliveryDate('');
    } catch (error) {
      console.error('Request failed:', error);

      alert(
        'Failed to connect to the server.\n\n' +
          'Check the browser console for more details.'
      );
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-300 to-teal-400 p-8">
      <div className="max-w-4xl mx-auto bg-transparent rounded-lg p-6">
        <h1 className="text-4xl font-semibold text-center mb-6 tracking-wide">
          Shipping Request Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Today's Date */}
          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">
              Today's Date:
            </label>

            <Input
              type="date"
              value={today}
              readOnly
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          {/* Requested Ship Date */}
          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">
              Requested Ship Date:
            </label>

            <Input
              type="date"
              value={shipDate}
              onChange={(e) => setShipDate(e.target.value)}
              required
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          {/* Requested Delivery Date */}
          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">
              Requested Delivery Date:
            </label>

            <Input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          {/* Sender */}
          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">
              Sender:
            </label>

            <Input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              required
              placeholder="Jon Snow"
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          {/* Company */}
          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">
              Company:
            </label>

            <Input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Company name"
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          {/* Email, Phone, Address */}
          <div className="grid grid-cols-12 gap-4">

            {/* Email */}
            <div className="col-span-4">
              <label className="text-sm font-medium uppercase">
                Email
              </label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@sample.com"
                required
                className="bg-white/80 px-4 py-3 rounded-md h-12"
              />
            </div>

            {/* Phone */}
            <div className="col-span-4">
              <label className="text-sm font-medium uppercase">
                Phone Number
              </label>

              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="000 000 0000"
                required
                className="bg-white/80 px-4 py-3 rounded-md h-12"
              />
            </div>

            {/* Address */}
            <div className="col-span-4">
              <label className="text-sm font-medium uppercase">
                Address
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Type your answer here"
                className="w-full bg-white/80 px-4 py-3 rounded-md h-28 resize-none outline-none"
              />
            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-transparent border-2 border-black px-6 py-2 rounded-md font-medium hover:bg-black/10"
            >
              Submit Request
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ShippingRequest;