import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import markdown from 'markdown-it';  // Use markdown-it to convert Markdown to HTML
import cors from "cors"
import { marked } from 'marked';


dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
const trail: string | any[] = []
const trailUsed: any = []
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT
const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Middleware to authenticate and decode JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = decoded; // Attach decoded user data to the request object
    next();
  });
};
async function getUserTokens(userId  : any) {
  try {
    // Fetch user by ID and select the token fields
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        oauthToken: true,         // Fetch OAuth token
        oauthTokenSecret  :true,
        mediumToken: true,        // Fetch Medium token
        consumerKey: true,        // Fetch Twitter consumer key (optional)
        consumerSecret: true,     // Fetch Twitter consumer secret (optional)
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    throw error; // Rethrow the error for the calling function to handle
  }
}
const OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY || '';  // Ensure your API key is in the .env file
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || '';  // Your OpenAI API endpoint

// Helper function to get GPT response
const getGptResponse = async (prompt: string): Promise<string> => {
  console.log(OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT)
  try {
    const response = await axios.post(AZURE_OPENAI_ENDPOINT, {
      model: 'gpt-3.5-turbo', // Choose the appropriate GPT model version
      messages: [
        { role: 'system', content: 'You are a creative assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4096,  // Adjust based on the expected response length
    }, {
      headers: {
        'api-key': OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const gptResponse = response.data;
    return gptResponse.choices[0]?.message?.content?.trim() || 'No response from GPT';
  } catch (error) {
    console.error('Error fetching GPT response:', error);
    throw new Error('Unable to generate content');
  }
};



// Sign-up Endpoint
app.post('/signup', async (req: any, res: any) => {
  const { email, password } = req.body;
  console.log(email + "reached")
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    // @ts-ignore
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  const token = generateToken(newUser.id);

  res.status(201).json({ message: 'User created', token });
});

// Sign-in Endpoint
app.post('/signin', async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.id);

  res.json({ message: 'Signed in successfully', token });
});

// Endpoint to store credentials by user ID from JWT
app.post('/credentials', authenticateToken, async (req: any, res: any) => {
  const { consumerKey, consumerSecret, oauthToken, oauthTokenSecret, mediumToken,slackWebHook } = req.body;

  // Validate the input
  if (!consumerKey || !consumerSecret || !oauthToken || !oauthTokenSecret || !mediumToken || slackWebHook) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Get user ID from the JWT
    const userId = req.user?.userId; // The userId is extracted from the JWT

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token.' });
    }

    // Find the user by ID (from the JWT)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's credentials
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        consumerKey,
        consumerSecret,
        oauthToken,
        oauthTokenSecret,
        mediumToken,
      },
    });

    res.status(200).json({
      message: 'Credentials stored successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to store credentials' });
  }
});


function parseJsonString(input: string) {
  try {
    // Clean up common issues like newlines within strings and other escape sequences
    const cleanedInput = input.replace(/\\n/g, '').replace(/\\t/g, '').replace(/\\r/g, '').replace(/\\"/g, '"');
    
    // Parse the cleaned input as JSON
    const parsedJson = JSON.parse(cleanedInput);
    
    return parsedJson;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}



// Generate Endpoint: Receives a topic and returns a blog (with title, content, tags) and a tweet
app.post('/generate', async (req : any, res:any) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  try {
    // Create a prompt for blog generation with title, content, and tags
    const blogPrompt = `Write a detailed blog post about the topic: "${topic}". Provide a brief explanation about it.`;

    // Create a prompt for tweet generation
    const tweetPrompt = `Write a short tweet about the topic: "${topic}". Make it catchy and engaging.`;

    // Get the blog and tweet from GPT
    const blogContent = await getGptResponse(blogPrompt);
    const tweetContent = await getGptResponse(tweetPrompt);

    // Parse the blog content into structured JSON
    let blogData: { title: string, content: string} = { title: topic, content: blogContent};


    // Send back the generated content in JSON format
    res.status(200).json({
      blog: {
        title: blogData.title || 'Untitled Blog',
        content: blogData.content || 'No content available',
      },
      tweet: tweetContent || 'No tweet generated',
    });
  } catch (error :any) {
    res.status(500).json({ message: 'Failed to generate content', error: error.message });
  }
});





let slack: string | Blob = "https://hooks.slack.com/services/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"; 
// Function to publish to Medium
const publishToMedium = async (data: { article_name: any; article_content: any; article_tags: string; token : string}) => {
  if(!data.token){
    throw new Error("Token missing")
  }
  try {
    const kestraUrl = 'http://localhost:8080/api/v1/executions/company.team/medium_publish_article';

    
    // Create a FormData object to mimic Python's multipart/form-data
    let str = data.article_content.toString().replace(/\n/g, "\\n");
    const formData = new FormData();
    formData.append('article_title', data.article_name);
    formData.append('article_content',data.article_content.toString())
    formData.append('article_tags',data.article_tags)
    formData.append('token',data.token)
    formData.append('slack',slack)
    console.log(formData);
    // Send the POST request with appropriate headers
    const response = await axios.post(kestraUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error:any) {
    console.error('Error posting to medium via Kestra:', error.message);
    throw new Error('Failed to post to medium via Kestra');
  }
};



// Helper function to trigger Kestra workflow for Twitter post
const postToTwitterViaKestra = async (tweetText: string, tokens: any) => {
  try {
    const kestraUrl = 'http://localhost:8080/api/v1/executions/company.team/twitter_post';

    if (!tokens.consumerKey || !tokens.consumerSecret || !tokens.oauthToken || !tokens.oauthTokenSecret) {
      throw new Error("Twitter API credentials are missing from environment variables.");
    }
    
    // Create a FormData object to send the tweet text and keys
    const formData = new FormData();
    formData.append('tweet_text', tweetText);
    formData.append('consumer_key', tokens.consumerKey);
    formData.append('consumer_secret', tokens.consumerSecret);
    formData.append('oauth_token', tokens.oauthToken);
    formData.append('oauth_token_secret', tokens.oauthTokenSecret);

    // Send the POST request to Kestra with the credentials and tweet text
    const response = await axios.post(kestraUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Error posting to Twitter via Kestra:', error.message);
    throw new Error('Failed to post to Twitter via Kestra');
  }
};

// Endpoint to handle article publishing

app.post('/publish', authenticateToken,async (req:any, res:any) => {
  const { article_name, article_content, tweet_text,trail } = req.body;
  let tokens :any = {};
  console.log(trailUsed)
  if(trail && !trailUsed.includes(req.user.userId)){
    trailUsed.push(req.user.userId)
    console.log(process.env.MEDIUM_TOKEN)
    tokens = {
      mediumToken : process.env.MEDIUM_TOKEN,
      consumerKey : process.env.CONSUMER_KEY,
      consumerSecret : process.env.CONSUMER_SECRET,
      oauthToken : process.env.OAUTH_TOKEN,
      oauthTokenSecret : process.env.OAUTH_TOKEN_SECRET,
    }

  }else{
    return res.status(500).json("Your free trail has been used")
  }
  
  console.log(req.user)
  if(!trail){
    tokens = await getUserTokens(req.user.userId);
  }
  if (!article_name || !article_content || !tweet_text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if(!tokens.mediumToken && trailUsed.includes(req.userId)){
    return res.status(400).json({ message: 'Give your credentials' });
  }
  const article_tags = "#Trending"
  try {
    // Publish to Medium
    const token = tokens.mediumToken;
    console.log("Token"+tokens.mediumToken)
    const mediumResponse = await publishToMedium({ article_name, article_content, article_tags,token});

    // Post to Twitter via Kestra
    const twitterResponse = await postToTwitterViaKestra(tweet_text,tokens);
    res.status(200).json({
      message: 'Content published successfully',
      medium: mediumResponse.id,
      twitter: twitterResponse.id
    });
  } catch (error:any) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to publish content', error: error.message });
  }
});

app.get("/trail", authenticateToken, (req:any, res:any) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    // Assuming 'trail' is an array of user objects or identifiers
    if (trail.includes(req.user)) {
      return res.json({ msg: "FreeTrail completed" });
    }
    return res.json({ msg: "approved" });
  } catch (error:any) {
    console.error("Error in /trail route:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});
app.get("/check",(req:any,res:any)=>{
  res.send("Yeah its up")
})

export default app;
