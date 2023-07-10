import * as Realm from "realm-web";
import { MessageItem } from "./types";
import { ObjectId } from "bson";
/**
 * function that confirms a user through a given token and tokenId
 * @param token token to confirm
 * @param tokenId id of the token to confirm
 * @returns boolean indicating whether the confirmation was successful
 */
export const confirmUser = async (token: string, tokenId: string) => {
  try {
    const app = Realm.App.getApp("data-jrnnm");
    console.log("confirming user...");
    await app.emailPasswordAuth.confirmUser({
      token,
      tokenId,
    });
    console.log("confirmed user!");
    return true;
  } catch (err) {
    console.error("Failed to confirm user: ", err);
    alert("Failed to confirm user: " + err);
    return false;
  }
};

/**
 * function that creates a new application in the DB with the given name and messages
 * @param name name of the new application
 * @param applicationType type of the new application
 * @param messageItems messages to upload
 * @param image image to upload
 * @returns boolean indicating whether the upload was successful
 */

export const uploadApplication = async (
  name: string,
  applicationType: string,
  messageItems: Array<MessageItem>,
  image: File
) => {
  try {
    // turn image into base64
    const reader = new FileReader();
    reader.readAsDataURL(image);
    let binaryStr: string | undefined;
    reader.onloadend = function () {
      binaryStr = reader.result as string;
    };

    // upload application
    const app = Realm.App.getApp("data-jrnnm");
    const credentials = Realm.Credentials.apiKey(
      process.env.REACT_APP_API_KEY!
    );
    const user = await app.logIn(credentials);
    console.log("uploading application...");
    await user.callFunction("createNewApplication", {
      applicationName: name,
      type: applicationType,
      messages: messageItems,
      image: binaryStr!,
      timeStamp: new Date(),
    });
    console.log("uploaded application!");
    return true;
  } catch (err) {
    console.error("Failed to upload application: ", err);
    alert("Failed to upload application: " + err);
    return false;
  }
};

/**
 * function that deletes an application from the DB with the given name
 * @param name name of the application to delete
 * @returns boolean indicating whether the deletion was successful
 */
export const deleteApplication = async (name: string) => {
  try {
    const app = Realm.App.getApp("data-jrnnm");
    const credentials = Realm.Credentials.apiKey(
      process.env.REACT_APP_API_KEY!
    );
    const user = await app.logIn(credentials);
    console.log("deleting application...");
    const result = await user.callFunction("deleteApplication", {
      applicationName: name,
    });
    console.log(result);
    console.log("deleted application!");
    return result;
  } catch (err) {
    console.error("Failed to delete application: ", err);
    alert("Failed to delete application: " + err);
    return false;
  }
};

/**
 * function that resets a users password given a token and tokenId
 * @param password new password to reset to
 * @param token token to reset password
 * @param tokenId tokenId to reset password
 * @returns
 */
export const resetPassword = async (
  password: string,
  token: string,
  tokenId: string
) => {
  try {
    const app = Realm.App.getApp("data-jrnnm");
    console.log("resetting password...");
    await app.emailPasswordAuth.resetPassword({
      token,
      tokenId,
      password,
    });
    console.log(password);
    console.log("reset password!");
    return true;
  } catch (err) {
    console.error("Failed to reset password: ", err);
    alert("Failed to reset password: " + err);
    return false;
  }
};

// /**
//  * gets a BSC application from the database
//  * @param realmApp realm app that retrieves the application
//  * @param applicationName name of application to return
//  * @returns MessageItem[] of messages
//  */
// export const getApplication = async (applicationName: string) => {
//   const realmApp = Realm.App.getApp("data-jrnnm");
//   var application: any;
//   try {
//     application = await realmApp.currentUser!.callFunction(
//       "getApplication",
//       applicationName
//     );
//     console.log(application.result);
//   } catch (e) {
//     console.log(e);
//   }
//   return application.result;
// };

/**
 * checks if a given email and password belongs to an admin user
 * @param email email to check
 * @param password password to check
 * @returns boolean indicating whether the user is an admin
 */
export const isAdmin = async (email: string, password: string) => {
  try {
    const app = Realm.App.getApp("data-jrnnm");
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    if (user.id === "649beb6ee62aeb404bbbb6ca") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Failed to check if admin: ", err);
    return false;
  }
};

/**
 * function that retrieves the mood entries of a user for a given userId
 * @param userId the userId to get the mood entries for
 * @returns the corresponding mood entries to the dates and user
 */
export const getMood = async (userId: ObjectId) => {
  var ret: any;
  try {
    const realmApp = Realm.App.getApp("data-jrnnm");
    ret = await realmApp.currentUser!.callFunction("getMoodScore", {
      userId: userId,
    });
  } catch (e) {
    console.log(e);
  }

  return ret.result.moods;

  // dummy data with random moods and stresses
  // const dummyData: MoodEntry[] = [];
  // const dayLength = 24 * 60 * 60 * 1000;
  // const currdate = new Date().valueOf();
  // for (let i = 20; i >= 0; i -= 1) {
  //   dummyData.push({
  //     _id: "test" + (i - 20).toString(),
  //     moodValue: Math.round(Math.random() * 10),
  //     stressValue: Math.round(Math.random() * 10),
  //     timeStamp: new Date(currdate - dayLength * i),
  //   });
  // }
  // return dummyData;
};

/**
 * function that retrieves the user id of a user given a first name and last name
 * @param firstName string representing the first name
 * @param lastName string representing the last name
 * @returns the corresponding user id
 */
export const getUserId = async (firstName: string, lastName: string) => {
  var ret: any;
  try {
    const realmApp = Realm.App.getApp("data-jrnnm");
    ret = await realmApp.currentUser!.callFunction("getUserId", {
      firstName,
      lastName,
    });
  } catch (e) {
    console.log(e);
    return false;
  }
  if (ret && ret.result && ret.result._id) return ret.result._id;
  else return false;
};
