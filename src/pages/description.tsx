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

    // TODO: schöne Erklärung (macht Markus)

    let condition = Cookies.get("condition")
    if (condition === "noBar") {

        return (
            <>
                <Head />
                <PageContainer className="space-y-8">
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
                        <h2>KEINE BAR</h2>
                        <div className="space-y-2">
                            <p>Steht doch alles da du dummes Stück Scheiße!</p>
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
                    <h2>BAR</h2>
                    <div className="space-y-2">
                        <p>Steht doch alles da du dummes Stück Scheiße!</p>
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
