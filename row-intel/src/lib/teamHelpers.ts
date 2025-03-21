import { db } from "./firebase";
import {
  doc,
  collection,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
  addDoc,
  where,
  query,
} from "firebase/firestore";
import { nanoid } from "nanoid";

export const createTeam = async (teamName: string, userId: string) => {
  // Add team to teams collection
  const teamRef = collection(db, "teams");
  const joinCode = nanoid(6); // Generate a random 6 character code for joining the team

  const teamDoc = await addDoc(teamRef, {
    teamName: teamName,
    createdBy: userId,
    members: [userId],
    createdAt: new Date(),
    joinCode: joinCode,
    joinCodeExpires: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
    profilePhoto: "",
  });

  // Update the user's document with a new team id
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    teamIds: arrayUnion(teamDoc.id),
  });

  return { teamId: teamDoc.id, joinCode };
};

export const joinTeam = async (userId: string, inviteCode: string) => {
  try {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("joinCode", "==", inviteCode));
    const querySnapshot = await getDocs(q);

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

    return {
      success: true,
      message: "Successfully joined team",
      teamId: teamDoc.id,
    };
  } catch (error) {
    console.error("Error joining team:", error);
    return { success: false, error: "Server error" };
  }
};
