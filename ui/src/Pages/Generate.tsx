import { useState} from 'react';

const MainContentPage = () => {
  const [idea, setIdea] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to handle loader visibility
  let trails = localStorage.getItem("trails");
  // Fetch content from the backend
  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ topic: idea}),
      });
      const data = await response.json();
      console.log(data);
      setBlogTitle(data.blog.title);
      setBlogContent(data.blog.content);
      setTweet(data.tweet);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };



  const handlePublish = async () => {
    // Send the data to the /publish endpoint
    try {
      const res = await fetch('http://localhost:3000/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
            article_name : blogTitle, 
            article_content : blogContent,
            tweet_text : tweet,trail:true }),
      });
      const data =await res.json();
      console.log(data);
      localStorage.removeItem("trails");
    //   navigate('/success'); // Redirect after successful publish
    } catch (error) {
      console.error('Error publishing content:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-16 px-4">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-center mb-4">Share Your Idea</h2>

      {/* Link to credentials page */}

      {trails ? (<p className='text-center mb-4'>
        you got 1 trail
      </p>):
      (     
        <p className="text-center mb-4">
            Please enter your credentials (like Consumer Key) on the{' '}
            <a
                href="/credentials"
                className="text-blue-400 hover:underline"
            >
                credentials page
            </a>
            .
        </p>)}

      {/* Idea Input */}
      <div className="w-full max-w-3xl bg-black p-6 rounded-xl shadow-xl mt-10">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full p-4 border border-gray-700 rounded-lg bg-black text-white focus:outline-none"
          placeholder="Type your idea here..."
          rows={2}
        />
      </div>

      {/* Fetch Content Button */}
      <div className="w-full max-w-3xl flex justify-center mb-4">
        <button
          onClick={fetchContent}
          className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
        >
          Fetch Content
        </button>
      </div>

      {/* Loader while fetching Blog and Tweet */}
      {loading ? (
        <div className="w-full max-w-3xl flex justify-center mt-6">
          <div className="loader animate-spin h-8 w-8 border-t-4 border-white rounded-full"></div> {/* Custom loader */}
        </div>
      ) : (
        <>
          {/* Blog and Tweet Display after fetching */}
          <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 mb-6">
            {/* Blog Section */}
            <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-3">Blog Post</h3>
              <input
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                className="w-full p-4 border border-gray-700 rounded-lg bg-black text-white focus:outline-none mb-4"
                placeholder="Blog Title"
              />
              <textarea
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                className="w-full h-64 p-4 border border-gray-700 rounded-lg bg-black text-white focus:outline-none"
                rows={10}
                placeholder="Write your blog content here..."
              />

            </div>

            {/* Tweet Section */}
            <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-3">Tweet</h3>
              <textarea
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                className="w-full h-64 p-4 border border-gray-700 rounded-lg bg-black text-white focus:outline-none"
                rows={10}
                placeholder="Write your tweet here..."
              />
            </div>
          </div>

          {/* Post Button */}
          <div className="w-full max-w-3xl flex justify-center mt-6">
            <button
              onClick={handlePublish}
              className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
            >
              Publish
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContentPage;
