import { useState } from 'react';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CredentialPage = () => {
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [oauthToken, setOauthToken] = useState('');
  const [oauthTokenSecret, setOauthTokenSecret] = useState('');
  const [mediumToken, setMediumToken] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const navigate = useNavigate();
  const [ptext,setPtext] = useState("Don't have credentials get a ")
  const [trail,setTrail] = useState("Trail")
  const tooltips: { [key: string]: string } = {
    consumerKey: 'Your application’s unique identifier when connecting to third-party APIs.',
    consumerSecret: 'A secret key for authenticating your app to APIs.',
    oauthToken: 'A token for accessing user-specific resources on APIs.',
    oauthTokenSecret: 'A secret token paired with OAuth Token for secure API access.',
    mediumToken: 'A personal access token for Medium API integration.',
    slackWebhook: 'The URL used to send messages to a Slack channel.',
  };

  const sendCredentials = async (credentials:any) => {
    try {
      const response = await fetch('http://localhost:3000/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(credentials), // Convert credentials object to JSON
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Credentials sent successfully:', data);
    } catch (error:any) {
      console.error('Error sending credentials:', error.message);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendCredentials({
        consumerKey,
        consumerSecret,
        oauthToken,
        oauthTokenSecret,
        mediumToken,
        slackWebhook,
      });
    setConsumerKey('');
    setConsumerSecret('');
    setOauthToken('');
    setOauthTokenSecret('');
    setMediumToken('');
    setSlackWebhook('');
  };
  const handleTrail = async () =>{
    try {
        const response = await fetch('http://localhost:3000/trail', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const data = await response.json();
        if (data.msg === 'FreeTrail completed') {
            setPtext("Your free trails are completed")
            setTrail("")
        } else if (data.msg === 'approved') {
            localStorage.setItem('trails', '3'); // Set 'trails' to 3 in localStorage
            navigate('/generate'); // Navigate to the '/generate' page
        }
      } catch (error:any) {
        console.error('Error sending credentials:', error.message);
      }
  }
  return (
    <div className="flex bg-black text-white justify-center items-center p-4 pt-20">
      <div className="bg-transparent p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-6">Credentials</h2>
        <p className="text-sm text-center mb-4 text-gray-400">
          Your credentials are safe with us. We will never share your information without your consent.
        </p>
        <div className='flex text-md text-center mb-4 text-gray-400 justify-center items-center'>
            <p className="mr-1">
                {ptext}  
            </p>
            <button className='underline text-white' onClick={handleTrail}>
                    {trail} 
            </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'consumerKey', label: 'Consumer Key', value: consumerKey, setter: setConsumerKey },
            { id: 'consumerSecret', label: 'Consumer Secret', value: consumerSecret, setter: setConsumerSecret },
            { id: 'oauthToken', label: 'OAuth Token', value: oauthToken, setter: setOauthToken },
            { id: 'oauthTokenSecret', label: 'OAuth Token Secret', value: oauthTokenSecret, setter: setOauthTokenSecret },
          ].map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="block text-sm font-medium mb-2 flex items-center">
                {field.label}
                <span className="ml-2 text-gray-400 relative group cursor-pointer">
                  <Info size={16} />
                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 shadow-lg w-40">
                    {tooltips[field.id]}
                  </span>
                </span>
              </label>
              <input
                type="text"
                id={field.id}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full p-2 bg-black border border-white rounded text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder={`Enter your ${field.label}`}
              />
            </div>
          ))}

          {/* Medium Token (Full Width) */}
          <div className="mb-4 col-span-2">
            <label htmlFor="mediumToken" className="block text-sm font-medium mb-2 flex items-center">
              Medium Token
              <span className="ml-2 text-gray-400 relative group cursor-pointer">
                <Info size={16} />
                <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 shadow-lg w-40">
                  {tooltips['mediumToken']}
                </span>
              </span>
            </label>
            <input
              type="text"
              id="mediumToken"
              value={mediumToken}
              onChange={(e) => setMediumToken(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your Medium Token"
            />
          </div>

          {/* Slack Webhook (Full Width) */}
          <div className="mb-4 col-span-2">
            <label htmlFor="slackWebhook" className="block text-sm font-medium mb-2 flex items-center">
              Slack Webhook
              <span className="ml-2 text-gray-400 relative group cursor-pointer">
                <Info size={16} />
                <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 shadow-lg w-40">
                  {tooltips['slackWebhook']}
                </span>
              </span>
            </label>
            <input
              type="text"
              id="slackWebhook"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              className="w-full p-2 bg-black border border-white rounded text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your Slack Webhook"
            />
          </div>

          <div className="mt-6 col-span-2">
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-300 transition"
            >
              Submit Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredentialPage;
