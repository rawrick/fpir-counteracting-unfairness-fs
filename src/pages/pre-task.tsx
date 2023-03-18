import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { preventBackButton } from "../../lib/prevent-back-button";
import { getRandomInt } from "../../lib/rand-int";
import { createPreTaskQuestion } from "../api";
import { Button, Head, PageContainer } from "../components";

const PreTask: NextPage = () => {

  const help = Cookies.get("helpPreTask")
  console.log(help)
  if (help === "NEIN") {
    console.log("!HELP: ", Cookies.get("topics"))
    return undefined
  }

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>("");
  const [snippetId, setSnippetId] = useState<number>();
  const userId = Cookies.get("userId");
  const stance = Cookies.get("stance");
  const router = useRouter();

  const topics = JSON.parse(Cookies.get("topics"))
  //console.log(topics)
  //console.log(topics[0])
  const topic = topics.shift()
  console.log(topic)
  //const topic = topics[0]

  preventBackButton();

  const { data: queries, error: queryError } = useSWR(
    () => `/api/queries`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: snippets, error: snippetError } = useSWR(
    () => `/api/snippets`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // useEffect(() => {
  //   if (snippets) {
  //     const { featuredSnippets } = snippets;

  //     const randomIndex = getRandomInt(0, 1);
  //     const featuredSnippet = (featuredSnippets?.filter(
  //       (snippet) =>
  //         (stance === "pos" ? snippet.stance > 0 : snippet.stance < 0) &&
  //         snippet.topic === topic
  //     ))[randomIndex];

  //     Cookies.set("snippetId", featuredSnippet?.id);
  //     setSnippetId(featuredSnippet?.id);
  //   }
  // }, [snippets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { featuredSnippets } = snippets;

    const randomIndex = getRandomInt(0, 1);
    const featuredSnippet = (featuredSnippets?.filter(
      (snippet) =>
        (stance === "pos" ? snippet.stance > 0 : snippet.stance < 0) &&
        snippet.topic === topic
    ))[randomIndex];

    Cookies.set("snippetId", featuredSnippet?.id);

    // Set Cookies
    Cookies.set("helpPreTask", "NEIN")
    Cookies.set("topics", JSON.stringify(topics))
    Cookies.set("topic", topic)
    

    // Replace new lines of explanation with actual <br> tags
    const explanationWithBreaks = explanation.replace(/\n/g, "<br>");

    const data = {
      userId,
      topic,
      snippetId: featuredSnippet?.id,
      explanation: explanationWithBreaks,
    };

    try {
      await createPreTaskQuestion(data);
      router.push("/serp");
    } catch (e) {
      console.log(e);
    }

    setIsSubmitting(false);
  };

  if (!queries || !snippets) return <div>Loading...</div>;
  if (queryError) return <div>Error: {queryError.message}</div>;
  if (snippetError) return <div>Error: {snippetError.message}</div>;

  return (
    <>
      <Head />
      <PageContainer className="space-y-8">
        <h2>Pre Task Questionnaire</h2>
        <div className="space-y-2">
          <h3>
            You previously selected that you did not have a strong opinion about
            the following topic:
          </h3>
          <h3 className="p-4 bg-slate-200 rounded-md">
            {queries[topic]["topic"]}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <p>
            If you had to explain, which arguments for and against do you see in
            the following topic. Please explain your thinking. <br />
            (It's ok if you don't know anything about the subject - you are not
            forced to write anything.)
          </p>
          <textarea
            className="block w-full p-3 shadow-sm border-slate-300 border rounded-md h-[200px] text-lg"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />

          <Button isLoading={isSubmitting} disabled={isSubmitting}>
            Continue
          </Button>
        </form>
      </PageContainer>
    </>
  );
};

export default PreTask;
