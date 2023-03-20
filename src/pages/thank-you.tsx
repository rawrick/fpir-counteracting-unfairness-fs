import { NextPage } from "next";
import Link from "next/link";
import { preventBackButton } from "../../lib/prevent-back-button";
import { Button } from "../components";
import { Head } from "../components/Head";
import { PageContainer } from "../components/PageContainer";

const ThankYou: NextPage = () => {
  preventBackButton();
  return (
    <>
      <Head />
      <PageContainer className="space-y-8">
        <h2>Thank You!</h2>
        <div className="space-y-2">
          <p>You've done it! Thank you for your participation.</p>
          <p>Please click this <a className="text-[#0000ff]" href="https://forms.gle/SyAqHpQeo5pdrqMP9"> <u>Google Forms link</u></a> and fill out the form if you want to receive VP-Stunden</p>
        </div>
      </PageContainer>
    </>
  );
};

export default ThankYou;
