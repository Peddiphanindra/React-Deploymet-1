import { useState } from 'react';
import { createDataSDK, gql } from '@salesforce/platform-sdk/data';
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
      const dataSdk = await createDataSDK();

      const mutation = gql`
        mutation CreateShippingRequest(
          $input: Shipping_Request_Form__cCreateInput!
        ) {
          uiapi {
            Shipping_Request_Form__cCreate(input: $input) {
              Record {
                Id
                Name {
                  value
                }
              }
            }
          }
        }
      `;

      const result = await dataSdk.graphql?.mutate({
        mutation,
        variables: {
          input: {
            Shipping_Request_Form__c: {
              Company__c: company,
              Sender__c: sender,
              Email__c: email,
              Phone__c: phone,
              Address__c: address,
              Requested_ship_Date__c: shipDate,
              Requested_Delivery_Date__c: deliveryDate,
              Today_Date__c: new Date().toISOString().split('T')[0],
            },
          },
        },
      });

      console.log('FULL SALESFORCE RESPONSE:', result);

      if (result?.errors?.length) {
        console.error('Salesforce GraphQL errors:', result.errors);

        alert(
          'Salesforce error:\n' +
            result.errors.map((error) => error.message).join('\n')
        );

        return;
      }

      const responseData = result?.data as any;

      const record =
        responseData?.uiapi?.Shipping_Request_Form__cCreate?.Record;

      if (!record?.Id) {
        console.error('No Salesforce Record ID returned.');
        console.error('Full response:', result);

        alert(
          'Record was NOT created in Salesforce.\n' +
            'No Salesforce Record ID was returned.'
        );

        return;
      }

      console.log('Created Salesforce Record ID:', record.Id);

      alert(
        `Shipping request created successfully!\n\nSalesforce Record ID: ${record.Id}`
      );

      setCompany('');
      setSender('');
      setEmail('');
      setPhone('');
      setAddress('');
      setShipDate('');
      setDeliveryDate('');
    } catch (error) {
      console.error('Error creating Salesforce record:', error);

      alert(
        'Failed to create the Salesforce record.\n' +
          'Check the browser console for details.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-300 to-teal-400 p-8">
      <div className="max-w-4xl mx-auto bg-transparent rounded-lg p-6">
        <h1 className="text-4xl font-semibold text-center mb-6 tracking-wide">
          Shipping Request Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">Today's Date:</label>
            <Input
              type="date"
              value={new Date().toISOString().split('T')[0]}
              readOnly
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">Requested Ship Date:</label>
            <Input
              type="date"
              value={shipDate}
              onChange={(e) => setShipDate(e.target.value)}
              required
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">Requested Delivery Date:</label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              required
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">Sender:</label>
            <Input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              required
              placeholder="Jon Snow"
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium uppercase">Company:</label>
            <Input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Company name"
              className="bg-white/80 px-4 py-3 rounded-md h-12"
            />
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <label className="text-sm font-medium uppercase">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@sample.com"
                required
                className="bg-white/80 px-4 py-3 rounded-md h-12"
              />
            </div>

            <div className="col-span-4">
              <label className="text-sm font-medium uppercase">Phone Number</label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="000 000 0000"
                required
                className="bg-white/80 px-4 py-3 rounded-md h-12"
              />
            </div>

            <div className="col-span-4">
              <label className="text-sm font-medium uppercase">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Type your answer here"
                className="w-full bg-white/80 px-4 py-3 rounded-md h-28 resize-none outline-none"
              />
            </div>
          </div>

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
