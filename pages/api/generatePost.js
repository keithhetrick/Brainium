import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("AI-Blog-Generator");
  const userProfile = await db.collection("users").findOne({
    auth0Id: user?.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  if (!topic || !keywords) {
    res.status(422).json({
      success: false,
      error: "Missing topic or keywords",
    });
  }

  if (topic.length > 80 || keywords.length > 80) {
    res.status(422).json({
      success: false,
      error: "Topic or keywords are too long",
    });
  }

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0, // 0 = no creativity, 1 = very creative
    max_tokens: 3600,
    prompt: `Write a long and detailed SEO-friendly blog about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
    The content should formatted in SEO-friendly HTML. 
    The response must also include appropriate HTML title and meta description content.
    The return format must be stringified JSON in the following format:
    {
      "postContent: post content here
      "title": title goes here,
      "metaDescription": meta description goes here
    }`,
  });

  console.log("\nRESPONSE", response);

  await db.collection("users").updateOne(
    {
      auth0Id: user?.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  const parsed = JSON.parse(
    response.data.choices[0]?.text.split("\n").join("")
  );

  const post = await db.collection("posts").insertOne({
    postContent: parsed?.postContent,
    title: parsed?.title,
    metaDescription: parsed?.metaDescription,
    topic,
    keywords,
    userId: userProfile?._id,
    created: new Date(),
  });

  console.log("\nPOST", post);

  res.status(200).json({
    postId: post?.insertedId,
  });
});
