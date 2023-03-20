import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createUser, updateUserCondition } from "../api";
import { Input } from "../components";
import { Button } from "../components/Button";
import { Head } from "../components/Head";
import { PageContainer } from "../components/PageContainer";
import Cookies from "js-cookie";
import { getRandomInt } from "../../lib/rand-int";

const possibleStance = ["pos", "neg"];

const Home: NextPage = () => {
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [prolificId, setProlificId] = useState<string>("");
  const router = useRouter();


  //TODO: aus Datenbank auslesen welches der 3 Themen
  const conditions = ["noBar", "equalBar", "biasedBar"]
  let condition = Cookies.get("condition")
  if (!conditions.includes(condition)) {
    let randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
    Cookies.set("condition", randomCondition)
  }

  useEffect(() => {
    if (acceptedConsent && !isSubmitting) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [acceptedConsent, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      //const stance = possibleStance[getRandomInt(0, 1)];
      //Cookies.set("stance", stance);
      const user = await createUser(prolificId, " ");
      Cookies.set("userId", user.id);
      const usersCondition = Cookies.get("lowestCondition");
      Cookies.set("condition", usersCondition);

      try {
        await updateUserCondition(user.id, usersCondition);
  
        const [res] = await Promise.allSettled([
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]);
        //router.push("/post-task");
      } catch (e) {
        console.log(e);
      }

      // Redirect to the next page
      router.push("/pre-study");
    } catch (e) {
      console.error(e);
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Head />
      <PageContainer className="space-y-8">
        <img
          className="w-52"
          src="/images/ur-logo-wort-bildmarke-grau.png"
          alt="UR Logo"
        />
        <h2>Informed Consent of Participation</h2>
        <section className="space-y-4">
          <p>
            You are invited to participate in the online study Unfairness in Featured Snippets initiated and
            conducted by Tobias Wittl, Georg Dechant, Patrick Balla and Markus Stangl. The research is supervised by at the University of Regensburg. Please note:
          </p>
          <ul>
            <li>Your participation is entirely voluntary</li>
            <li>The online study will last approximately ??? minutes</li>
            <li>
              We will record basic personal demographics (age, gender, etc.)
            </li>
            <li>
              We may publish our results from this and other sessions in our
              reports, but all such reports will be confidential and will
              neither include your name nor cannot be associated with your
              identity
            </li>
          </ul>
          <p>
            If you have any questions or complaints about the whole informed
            consent process of this research study or your rights as a human
            research subject, please contact Dr. David Elsweiler (E-Mail:
            david.elsweiler@ur.de). You should carefully read the information
            below. Please take as much time as you need to read the consentform.
          </p>
        </section>
        <section className="space-y-4">
          <h2>1. Purpose and Goal of this Research</h2>
          <p>
            To explore the influence of visualisations on the fairness of featured snippets when
            search engines are used to form an opinion on a topic. Your
            participation will help us achieve this goal. The results of this
            research may be presented at scientific or professional meetings or
            published in scientific proceedings and journals.
          </p>
        </section>
        <section className="space-y-4">
          <h2>2. Participation and Compensation</h2>
          <p>
            Your participation in this online study is completely voluntary. You
            will be one of approximately 45 people being surveyed in this pilot
            study. You may receive ??? VP as compensation for your
            participation. You may withdraw and discontinue participation at any
            time without penalty or loss of compensation. If you decline to
            participate or withdraw from the online study, no one will be told.
            You may refuse to answer any questions you do not want to answer.
          </p>
        </section>
        <section className="space-y-4">
          <h2>3. Procedure</h2>
          <p>
            <strong>After confirming your informed consent you will:</strong>
          </p>
          <ol>
            <li>read and accept the declaration of consent</li>
            <li>indicate your position on the topics indicated</li>
            <li>interact with a series of search results</li>
            <li>restate your position and arguments on this issue</li>
          </ol>
          <p>
            Through pre-testing we estimate the completion of this online study
            to last approximately ?-? minutes.
          </p>
        </section>
        <section className="space-y-4">
          <h2>4. Risks and Benefits</h2>
          <p>
            There are no risks associated with this online study. Discomforts or
            inconveniences will be minor and are not likely to happen. If any
            discomforts become a problem, you may discontinue your
            participation. Your benefit in participating is your compensation of
            ??? VP.
          </p>
        </section>
        <section className="space-y-4">
          <h2>5. Data Protection and Confidentiality</h2>
          <p>
            Personal data (age, gender, etc.) will be recorded while
            participation. The researcher will not identify you by your real
            name in any reports using information obtained from this online
            study and that your confidentiality as a participant in this online
            study will remain secure and encrypted. All data you provide in this
            online study will be published anonymized and treated confidentially
            in compliance with the General Data Protection Regulation (GDPR) of
            the European Union (EU). Subsequent uses of records and data will be
            subject to standard data use policies which protect the full
            anonymity of the participating individuals. In all cases, uses of
            records and data will be subject to the GDPR. Faculty and
            administrators from the campus will not have access to raw data or
            transcripts. This precaution will prevent your individual comments
            from having any negative repercussions. This site uses cookies and
            other tracking technologies to conduct the research, to improve the
            user experience, the ability to interact with the system and to
            provide additional content from third parties. Despite careful
            control of content, the researchers assume no liability for damages,
            which directly or indirectly result from the use of this online
            application. Any recordings cannot be viewed by anyone outside this
            research project unless we have you sign a separate permission form
            allowing us to use them (see below). Records that have not been made
            public are automatically deleted after the end of the research. The
            records will be destroyed if you contact the researcher to destroy
            or delete them immediately. As with any publication or online
            related activity, the risk of a breach of confidentiality is always
            possible. According to the GDPR, the researchers will inform the
            participant if a breach of confidential data was detected.
          </p>
        </section>
        <section className="space-y-4">
          <h2>6. Identification of Investigators</h2>
          <p>
            If you have any questions or concerns about the research, please
            feel free to contact:
          </p>
          <ul>
            <li>Tobias Wittl (Tobias.Wittl@stud.uni-regensburg.de)</li>
            <li>Georg Dechant (Georg.Dechant@stud.uni-regensburg.de)</li>
            <li>Patrick Balla (Patrick.Balla@stud.uni-regensburg.de)</li>
            <li>Markus Stangl (Markus.Stangl@stud.uni-regensburg.de)</li>
          </ul>
        </section>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <p>
            <label className="space-x-2">
              <input
                type="checkbox"
                checked={acceptedConsent}
                onChange={() => setAcceptedConsent(!acceptedConsent)}
                required
              />
              <span>I have read and understood the consent form.</span>
            </label>
          </p>
          <Button isLoading={isSubmitting} disabled={isSubmitting}>
            Continue
          </Button>
        </form>
      </PageContainer>
    </>
  );
};

export default Home;
