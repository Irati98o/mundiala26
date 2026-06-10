import TeamSelector from "../components/TeamSelector";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export default function KOPhase({ user }) {

  const teams = ["España","Francia","Brasil","Argentina"];

  const save = async (selected) => {
    for (const team of selected) {
      await addDoc(collection(db, "user_predictions_teams"), {
        userId: user.id,
        team
      });
    }
  };

  return <TeamSelector teams={teams} save={save} />;
}
