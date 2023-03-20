import Cookies from "js-cookie";
import router from "next/router";
import { useState } from "react";
import { clamp } from "../../lib/clamp";
import { preventBackButton } from "../../lib/prevent-back-button";
import { createPreStudyQuestions } from "../api";
import { Button, Head, LikertScale, PageContainer } from "../components";
import { getRandomInt } from "../../lib/rand-int";

const questions = [
  {
    topic: "schoolUniforms",
    question: "Should students wear school uniform?",
    value: null,
  },
  {
    topic: "propertyRights",
    question: "Should intellectual property rights exist?",
    value: null,
  },
  {
    topic: "obesity",
    question: "Is Obesity a Disease?",
    value: null,
  },
  {
    topic: "cellphoneRadiation",
    question: "Is cell phone radiation safe?",
    value: null,
  },
  {
    topic: "zoos",
    question: "Should Zoos exist?",
    value: null,
  },
  {
    topic: "networkingSites",
    question: "Are social networking sites good for our society?",
    value: null,
  },
];

const possibleStance = ["pos", "neg"];

interface LikertQuestion {
  topic: string;
  question: string;
  value: number | null;
}

const PreStudy = () => {
  const [question, setQuestion] = useState<LikertQuestion[]>(questions);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const userId = Cookies.get("userId");
  const userCondition = Cookies.get("lowestCondition");

  preventBackButton();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setQuestion(
      question.map((q) => {
        if (q.topic === name) {
          return {
            ...q,
            value: parseInt(value),
          };
        }
        return q;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = question.map((q) => {
      return {
        userId,
        topic: q.topic,
        fsStance: possibleStance[getRandomInt(0, 1)],
        stance: clamp(q.value),
        condition: userCondition,
      };
    });

    // Get all mild stances between -1 and 1 included
    const mildStances = data.filter((q) => q.stance >= -1 && q.stance <= 1);

    try {
      await createPreStudyQuestions(mildStances);

      // If there are no mild stances, redirect to the next page
      if (mildStances.length === 0) {
        router.push("/thank-you");
        return;
      }
     
      let workStances = mildStances;

      workStances.sort(() => Math.random() - 0.5)

      let mildTopics = []
      let topicsStances = []
      workStances.forEach((obj) => {
        mildTopics.push(obj.topic)
        topicsStances.push(obj.fsStance)
      })

      Cookies.set("topics", JSON.stringify(mildTopics));
      Cookies.set("fsStances", JSON.stringify(topicsStances))
      Cookies.set("helpPreTask", "true")
    

      router.push("/pre-task");
    } catch (e) {
      console.log(e);
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Head />
      <PageContainer className="space-y-8">
        <h1>Pre-Study Questionnaire</h1>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
          <h3>
            Please state to which degree you agree or disagree with the
            following topics
          </h3>
          {question.map((q) => (
            <div
              key={q.topic}
              className="border-2 p-4 rounded-lg border-slate-200">
              <LikertScale
                key={q.topic}
                name={q.topic}
                question={q.question}
                minLabel="Strongly Disagree"
                maxLabel="Strongly Agree"
                numButtons={7}
                selected={q.value}
                onChange={handleChange}
              />
            </div>
          ))}
          <Button isLoading={isSubmitting} disabled={isSubmitting}>
            Continue
          </Button>
        </form>
      </PageContainer>
    </>
  );
};

export default PreStudy;
