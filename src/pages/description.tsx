import Cookies from "js-cookie";
import { NextPage } from "next";
import Link from "next/link";
import { preventBackButton } from "../../lib/prevent-back-button";
import { Button } from "../components";
import { Head } from "../components/Head";
import { PageContainer } from "../components/PageContainer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ThankYou: NextPage = () => {
    preventBackButton();

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            router.push("/pre-task")
        }
        catch (e) {
            setIsSubmitting(false)
        }

        setIsSubmitting(false)
    }

    let condition = Cookies.get("condition")
    if (condition === "noBar") {

        return (
            <>
                <Head />
                <PageContainer className="space-y-8">
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
                        <h2>Explanation</h2>
                        <div className="space-y-2">
                            <p>In the following pages you will work through some topics.</p>
                            <p>For each topic you will be asked to shortly summarize what your reasoning behind your answer was.</p>
                            <p>Then we will show you a search engine result page for the specific topic.</p>
                            <p>You can navigate the page by clicking on the blue links to get to the corresponding websites. (Please note that the websites will open in a new tab, if you want to go back to the search results page simply close the tab)</p>
                            <p>Please use the search result page like you would in your everyday life and you want to research a topic. (You do not have to visit all or even any pages if this reflects your normal research habits)</p>
                            <p>When you feel like you educated yourself on the topic you can click the continue button and will be asked to state your opinion now, after researching.</p>
                        </div>
                        <Button isLoading={isSubmitting} disabled={isSubmitting}>
                            Continue
                        </Button>
                    </form>
                </PageContainer>
            </>
        )


    }

    return (
        <>
            <Head />
            <PageContainer className="space-y-8">
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
                    <h2>Explanation</h2>
                    <div className="space-y-2">
                        <p>In the following pages you will work through some topics.</p>
                        <p>For each topic you will be asked to shortly summarize what your reasoning behind your answer was.</p>
                        <p>Then we will show you a search engine result page for the specific topic.</p>
                        <p>You can navigate the page by clicking on the blue links to get to the corresponding websites. (Please note that the websites will open in a new tab, if you want to go back to the search results page simply close the tab)</p>
                        <p>Please use the search result page like you would in your everyday life and you want to research a topic. (You do not have to visit all or even any pages if this reflects your normal research habits)</p>
                        <p>At the top of the search engine result page will be a bar chart that shows the distribution of documents/websites that are pro or contra regarding that topic. The distribution is calculated with all available documents and is not represented by the 10 websites you receive on your page.</p>
                        <p>When you feel like you educated yourself on the topic you can click the continue button and will be asked to state your opinion now, after researching.</p>
                    </div>
                    <Button isLoading={isSubmitting} disabled={isSubmitting}>
                        Continue
                    </Button>
                </form>
            </PageContainer>
        </>
    )
};

export default ThankYou;
