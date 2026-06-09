export default async function handler(req, res){

  const API_KEY = "4e0c180e61000b9702065994866b6205";

  const today = new Date().toISOString().split("T")[0];

  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${today}`,
    {
      headers: {
        "x-apisports-key": API_KEY
      }
    }
  );

  const data = await response.json();

  res.status(200).json(data.response);
}
