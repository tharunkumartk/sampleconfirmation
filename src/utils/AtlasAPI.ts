import * as Realm from "realm-web";
import { MessageItem } from "./types";

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
    return false;
  }
};

/**
 * function that creates a new application in the DB with the given name and messages
 * @param name name of the new application
 * @param messageItems messages to upload
 * @returns
 */

export const uploadApplication = async (
  name: string,
  messageItems: Array<MessageItem>
) => {
  try {
    const app = Realm.App.getApp("data-jrnnm");
    const credentials = Realm.Credentials.apiKey(
      process.env.REACT_APP_API_KEY!
    );
    const user = await app.logIn(credentials);
    console.log("uploading application...");
    await user.callFunction("createNewApplication", {
      applicationName: name,
      messages: messageItems,
    });
    console.log("uploaded application!");
    return true;
  } catch (err) {
    console.error("Failed to upload application: ", err);
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
    console.log("deleted application!");
    return result;
  } catch (err) {
    console.error("Failed to delete application: ", err);
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
    await app.emailPasswordAuth.resetPassword({ token, tokenId, password });
    console.log("reset password!");
    return true;
  } catch (err) {
    console.error("Failed to reset password: ", err);
    return false;
  }
};
