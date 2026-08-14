export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const {
      company,
      sender,
      email,
      phone,
      address,
      shipDate,
      deliveryDate,
    } = req.body || {};

    // Validate required fields
    if (
      !company ||
      !sender ||
      !email ||
      !phone ||
      !address ||
      !shipDate ||
      !deliveryDate
    ) {
      return res.status(400).json({
        error: 'All shipping request fields are required.',
      });
    }

    // --------------------------------------------------
    // 1. Get Salesforce OAuth access token
    // --------------------------------------------------

    const loginUrl =
      process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

    const tokenResponse = await fetch(
      `${loginUrl}/services/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.SALESFORCE_CLIENT_ID,
          client_secret: process.env.SALESFORCE_CLIENT_SECRET,
        }),
      }
    );

    const tokenText = await tokenResponse.text();

    let tokenData;

    try {
      tokenData = JSON.parse(tokenText);
    } catch {
      console.error('Salesforce OAuth returned non-JSON:', tokenText);

      return res.status(502).json({
        error: 'Salesforce OAuth returned an invalid response.',
      });
    }

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Salesforce OAuth error:', tokenData);

      return res.status(401).json({
        error: 'Salesforce authentication failed.',
        details: tokenData,
      });
    }

    // --------------------------------------------------
    // 2. Get Salesforce instance URL
    // --------------------------------------------------

    const instanceUrl = tokenData.instance_url;

    if (!instanceUrl) {
      return res.status(502).json({
        error: 'Salesforce did not return an instance URL.',
      });
    }

    // --------------------------------------------------
    // 3. Create Shipping Request record
    // --------------------------------------------------

    const apiVersion = 'v66.0';

    const salesforceResponse = await fetch(
      `${instanceUrl}/services/data/${apiVersion}/sobjects/Shipping_Request_Form__c`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Company__c: company,
          Sender__c: sender,
          Email__c: email,
          Phone__c: phone,
          Address__c: address,
          Requested_ship_Date__c: shipDate,
          Requested_Delivery_Date__c: deliveryDate,
          Today_Date__c: new Date().toISOString().split('T')[0],
        }),
      }
    );

    const salesforceText = await salesforceResponse.text();

    let salesforceData;

    try {
      salesforceData = JSON.parse(salesforceText);
    } catch {
      console.error(
        'Salesforce record API returned non-JSON:',
        salesforceText
      );

      return res.status(502).json({
        error: 'Salesforce returned an invalid response.',
      });
    }

    if (!salesforceResponse.ok) {
      console.error(
        'Salesforce record creation error:',
        salesforceData
      );

      return res.status(salesforceResponse.status).json({
        error: 'Salesforce record creation failed.',
        details: salesforceData,
      });
    }

    // --------------------------------------------------
    // 4. Return success to React
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      id: salesforceData.id,
      successMessage: 'Shipping request created successfully.',
    });
  } catch (error) {
    console.error('Vercel API error:', error);

    return res.status(500).json({
      error: 'Internal server error.',
      message: error?.message || 'Unknown error',
    });
  }
}