import Cookies from "js-cookie";
import {
  PostTaskQuestion,
  PreStudyQuestion,
  PreTaskQuestion,
  User,
} from "@prisma/client";
import axios from "axios";
import { getRandomInt } from "../lib/rand-int";

const routes = {
  users: "/api/users",
  preStudyQuestions: "/api/prestudyquestions",
  preTaskQuestions: "/api/pretaskquestions",
  postTaskQuestions: "/api/posttaskquestions",
  pageVisits: "/api/pagevisits",
  clicks: "/api/clicks",
  demographics: "/api/demographics",
};

const possibleConditions = ['noBar', 'equalBar', 'biasedBar'];

/**
 * Creates a new user in the database.
 * @param prolificId The prolific id of the user.
 * @returns The user that was created.
 */

/** VERSION 2.0 */
export const createUser = async (
  prolificId: string,
  stance: string
): Promise<User> => {
  //Fetch preStudyQuestions
  const preStudyQuestions = await axios.get(routes.preStudyQuestions);

  const finishedUsers = await axios.get(routes.demographics);

  const userIds = finishedUsers.data.map(user => user.userId);

  console.log("userIDs:" + userIds);

  const filteredPreStudyQuestions = preStudyQuestions.data.filter(question => userIds.includes(question.userId));

  console.log("filtered:" + JSON.stringify(filteredPreStudyQuestions));

  //Count
  const conditionCounts = possibleConditions.reduce(
    (counts, condition) => ({
      ...counts,
      [condition]: filteredPreStudyQuestions.filter(
        (question) => question.condition === condition
      ).length,
    }),
    {}
  );

  /**
  const conditionCounts = possibleConditions.reduce(
    (counts, condition) => ({
      ...counts,
      [condition]: new Set(
        preStudyQuestions.data
          .filter((question) => question.condition === condition)
          .map((question) => question.userId)
      ).size,
    }),
    {}
  ); */
  
  console.log(conditionCounts);

  //Get Lowest Condition
  const lowestCountCondition = possibleConditions.reduce(
    (lowestCondition, condition) =>
      conditionCounts[condition] < conditionCounts[lowestCondition]
        ? condition
        : lowestCondition,
    possibleConditions[0]
  );

  Cookies.set("lowestCondition", lowestCountCondition);

  console.log(lowestCountCondition);

  //Actually create User
  const res = await axios.post(routes.users, {
    prolificId,
    stance,
  });

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create user");
  }
};



/** VERSION 1.0
export const createUser = async (
  prolificId: string,
  stance: string
): Promise<User> => {
  const res = await axios.post(routes.users, { prolificId, stance});

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create user");
  }
};
*/

/** VERSION 3.0
export const createUser = async (
  prolificId: string,
  stance: string,
  condition: string
): Promise<User> => {
  const res = await axios.post(routes.users, { prolificId, stance, condition });

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create user");
  }
};
*/

/**
 * Creates a new entry for the responses to the pre-study questions.
 * @param preStudyQuestion The pre-study question that the user answered.
 * @returns The pre-study question that was created.
 */
export const createPreStudyQuestions = async (
  preStudyQuestions
): Promise<void> => {
  const res = await axios.post(routes.preStudyQuestions, preStudyQuestions);

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create pre-study question");
  }
};

/**
 * Creates a new entry for the responses to the pre-task questions.
 * @param preTaskQuestion The pre-task question that the user answered.
 * @returns The pre-task question that was created.
 */
export const createPreTaskQuestion = async (preTaskQuestion): Promise<void> => {
  const res = await axios.post(routes.preTaskQuestions, preTaskQuestion);

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create pre-task question");
  }
};

/**
 * Creates a new entry for the responses to the post-task questions.
 * @param postTaskQuestion The post-task question that the user answered.
 * @returns The post-task question that was created.
 */
export const createPostTaskQuestion = async (
  postTaskQuestion
): Promise<void> => {
  const res = await axios.post(routes.postTaskQuestions, postTaskQuestion);

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create post-task question");
  }
};

/**
 * Creates a new entry when a user visits a page.
 * @param pageVisit The page and additional info the user clicked on.
 * @returns The page visit that was created.
 */
export const createPageVisit = async (pageVisit): Promise<void> => {
  var config = {
    headers: {'Access-Control-Allow-Origin': '*'}
  };
  const res = await axios.post(routes.clicks, pageVisit, config);

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create page visit");
  }
};

/**
 * Creates a new entry for the response to the demographic questions.
 * @param demographic The demographic data that the user filled out.
 * @returns The demographic data that was created.
 */
export const createDemographic = async (demographic): Promise<void> => {
  const res = await axios.post(routes.demographics, {
    ...demographic,
    age: parseInt(demographic.age),
  });

  if (res?.status === 201) {
    return res.data;
  } else {
    throw new Error("Failed to create demographic");
  }
};

/**
 *
 * @param userId The id of the user.
 * @param logic The logic that the user got presented in the Featured Snippet.
 * @returns The user that was updated.
 */
export const updateUserLogic = async (userId: string, logic: string) => {
  const res = await axios.post(`${routes.users}/${userId}`, { logic });

  if (res?.status === 200) {
    return res.data;
  } else {
    throw new Error("Failed to update user logic");
  }
};

/**
 *
 * @param userId The id of the user.
 * @param condition The condition that the user got presented in the Featured Snippet.
 * @returns The user that was updated.
 */
export const updateUserCondition = async (userId: string, logic: string) => {
  const res = await axios.post(`${routes.users}/${userId}`, { logic });

  if (res?.status === 200) {
    return res.data;
  } else {
    throw new Error("Failed to update user condition");
  }
};
