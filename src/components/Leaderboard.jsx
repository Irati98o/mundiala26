export default function Leaderboard({ users }) {
  return (
    <div>
      {users.sort((a,b)=>b.points-a.points).map((u,i)=>(
        <div key={i}>
          {i+1}. {u.user} - {u.points} pts
        </div>
      ))}
    </div>
  );
}
