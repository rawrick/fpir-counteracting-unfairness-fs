import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import {
  getAlternateSorting,
  list,
  StartingPoint,
} from "../../lib/get-alternate-sorting";
import { preventBackButton } from "../../lib/prevent-back-button";
import { getRandomInt } from "../../lib/rand-int";
import { createPageVisit, updateUserLogic } from "../api";
import {
  Button,
  FeaturedSnippet,
  Head,
  RegularSnippet,
  SearchHeader,
} from "../components";
import { useScroll } from "../hooks/useScroll";
import { IFeaturedSnippet, IRegularSnippet } from "../types";
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const SERP = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: snippets, error: snippetError } = useSWR(
    "/api/snippets",
    fetcher
  );
  const { data: queries, error: queryError } = useSWR("/api/queries", fetcher);
  const [featuredSnippet, setFeaturedSnippet] = useState<IFeaturedSnippet>();
  const [regularSnippets, setRegularSnippets] = useState<IRegularSnippet[]>([]);
  const [query, setQuery] = useState<string>("");
  const scroll = useScroll();
  const isScrolled = scroll >= 30;
  const router = useRouter();

  // Get cookies
  const userId = Cookies.get("userId");
  const topic = Cookies.get("topic");
  const stance = Cookies.get("stance");
  const snippetId = Cookies.get("snippetId");
  const condition = Cookies.get("condition")

  preventBackButton();

  const submitRating = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      router.push("/post-task");
    } catch (e) {
      console.log(e);
    }
    setIsSubmitting(false);
  };

  const handleClick = async (docId: number, position: number, url: string) => {
    // Store clicked url and its position in the DOM
    const data = {
      docId,
      userId,
      topic,
      position,
      url,
    };

    // Send data to backend
    await createPageVisit(data);
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (snippets) {
      const {
        featuredSnippets,
        regularSnippets,
      }: {
        featuredSnippets: IFeaturedSnippet[];
        regularSnippets: IRegularSnippet[];
      } = snippets;

      // Get snippets based on current topic
      let alternateSnippets = regularSnippets?.filter(
        (snippet) => snippet.topic === topic
      );

      // Alternate ordering of regularSnippets
      if (stance === "pos") {
        alternateSnippets = getAlternateSorting(
          regularSnippets,
          StartingPoint.neg
        );
      } else {
        alternateSnippets = getAlternateSorting(
          regularSnippets,
          StartingPoint.pos
        );
      }

      alternateSnippets = alternateSnippets.filter(
        (snippet) => snippet.topic === topic
      );

      setRegularSnippets(alternateSnippets);

      const featuredSnippet = featuredSnippets?.find(
        (snippet) => snippet.id === parseInt(snippetId)
      );
      setFeaturedSnippet(featuredSnippet);
    }
  }, [snippets, stance, topic]);

  // useEffect(() => {
  //   // Asynchoronously update the user with the featuredSnippets logic

  // const updateUser = async () => {
  //   const updatedUser = await updateUserLogic(userId, featuredSnippet.logic);
  // };

  //   if (featuredSnippet) {
  //     try {
  //       updateUser();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }, [featuredSnippet]);

  useEffect(() => {
    if (queries) {
      const queriesData = queries;
      setQuery(queriesData[`${topic}`]?.topic);
    }
  }, [queries]);

  if (!snippets) return <div>Loading...</div>;
  if (snippetError) return <div>Error: {snippetError.message}</div>;

  // Bar

  const biasedLower = 5;
  const biasedUpper = 30;
  const equalLower = 45;
  const equalUpper = 55;

  const colorPro = '#0097AC';
  const colorCon = '#ffa500';

  let proValue = +Cookies.get("proValue");

  if (proValue === -1) {
    switch (condition) {
      case "equalBar":
        proValue = Math.floor(Math.random() * (equalUpper - equalLower) + equalLower);
        Cookies.set("proValue", "" + proValue)
        break;
      case "biasedBar":
        proValue = Math.floor(Math.random() * (biasedUpper - biasedLower) + biasedLower);
        Cookies.set("proValue", "" + proValue)
        break;
      default:
        break;
    }
  }

  const chartData = {
    labels: [''],
    datasets: [
      {
        label: 'Pro',
        backgroundColor: colorPro,
        data: [proValue]
      },
      {
        label: 'Contra',
        backgroundColor: colorCon,
        data: [100 - proValue]
      }
    ]
  };

  const options = {
    responsive: true,
    indexAxis: 'y' as const,
    scales: {
      x: {
        stacked: true,
        display: false
      },
      y: {
        stacked: true,
        display: false
      }
    },
    barThickness: 50,
    events: []
  };

  let hide = false
  if (condition === 'noBar') {
    hide = true
  }

  return (
    <>
      <Head />
      <SearchHeader query={query} />
      <form
        className={`ml-[170px] max-w-[652px] py-8 space-y-14 ${isScrolled && "mt-20"
          }`}
        onSubmit={submitRating}>
        <div hidden={hide}>
          <Bar options={options} data={chartData} className={`max-h-[100px]`} />
        </div>
        <FeaturedSnippet
          onClick={() =>
            handleClick(featuredSnippet.id, 1, featuredSnippet.url)
          }
          snippet={featuredSnippet}
        />
        <div className="space-y-7">
          {regularSnippets
            .filter((snippet) => snippet.id !== featuredSnippet.id)
            .map((snippet: IRegularSnippet, index: number) => (
              <RegularSnippet
                onClick={() => handleClick(snippet.id, index + 2, snippet.url)}
                key={snippet.id}
                snippet={snippet}
              />
            ))}
        </div>
        <Button isLoading={isSubmitting} disabled={isSubmitting} type="submit">
          Continue
        </Button>
      </form>
    </>
  );
};

export default SERP;
