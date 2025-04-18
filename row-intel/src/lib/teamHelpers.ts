import { UUID } from "crypto";
import { db } from "./firebase";
import {
  doc,
  collection,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
  where,
  query,
  setDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";

export const createTeam = async (teamName: string, userId: string) => {
  // Add team to teams collection
  const teamId = crypto.randomUUID();
  const teamRef = doc(db, "teams", teamId);
  const joinCode = nanoid(6); // Generate a random 6 character code for joining the team

  await setDoc(teamRef, {
    teamId: teamId,
    teamName: teamName,
    createdBy: userId,
    members: [userId],
    createdAt: new Date(),
    joinCode: joinCode,
    joinCodeExpires: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
    profilePhoto: "",
  });

  console.log("Added team: ", teamId, "User: ", userId);

  // Update the user's document with a new team id
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    teamIds: arrayUnion(teamId),
  });

  return { teamId: teamId, joinCode };
};

export const joinTeam = async (userId: string, inviteCode: string) => {
  try {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("joinCode", "==", inviteCode));
    const querySnapshot = await getDocs(q);
    console.log("Query docs: ", querySnapshot);

    // No matching team found
    if (querySnapshot.empty) {
      return { success: false, error: "Invalid invite code" };
    }

    const teamDoc = querySnapshot.docs[0]; // Get the first doc with matching invite code
    const teamData = teamDoc.data();

    if (teamData.joinCodeExpires && teamData.joinCodeExpires < Date.now()) {
      return { success: false, error: "Invite code has expired" };
    }

    // Add user to team
    const teamRef = doc(db, "teams", teamDoc.id);
    await updateDoc(teamRef, {
      members: arrayUnion(userId), // Add userId to members array
    });

    // Add team id to user
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      teamIds: arrayUnion(teamData.teamId),
    });

    return {
      success: true,
      message: "Successfully joined team",
      teamId: teamData.teamId,
    };
  } catch (error) {
    console.error("Error joining team:", error);
    return { success: false, error: "Server error" };
  }
};

// Generate a random alphanumeric code
export const generateJoinCode = (length = 6): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

// Get team name by ID
export const getTeamName = async (teamId: string): Promise<string | null> => {
  const teamRef = doc(db, "teams", teamId);
  const teamSnap = await getDoc(teamRef);

  if (teamSnap.exists()) {
    return teamSnap.data().teamName;
  }

  return null;
};

// Check if join code has expired
export const getJoinCodeStatus = async (
  teamId: string
): Promise<{ joinCode: string; expired: boolean } | null> => {
  const teamRef = doc(db, "teams", teamId);
  const teamSnap = await getDoc(teamRef);

  if (!teamSnap.exists()) return null;

  const data = teamSnap.data();
  const now = Date.now();
  const expired = now > data.joinCodeExpires;

  return {
    joinCode: data.joinCode,
    expired,
  };
};

// Update the team with a new join code + expiration (1 week from now)
export const generateNewJoinCode = async (teamId: string): Promise<string> => {
  const newCode = generateJoinCode();
  const expiration = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, {
    joinCode: newCode,
    joinCodeExpires: expiration,
  });

  return newCode;
};

// Get full names of all team members by their user IDs
export const getTeamMemberNames = async (teamId: string): Promise<string[]> => {
  const teamRef = doc(db, "teams", teamId);
  const teamSnap = await getDoc(teamRef);

  if (!teamSnap.exists()) return [];

  const memberIds: string[] = teamSnap.data().members || [];

  // Parallel fetch names from `users` collection
  const nameFetches = memberIds.map(async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().firstName + " " + userSnap.data().lastName;
    } else {
      return "Unknown";
    }
  });

  return await Promise.all(nameFetches);
};

export const getTeamId = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data().teamIds[0];
  } else {
    return "";
  }
};
