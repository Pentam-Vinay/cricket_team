const express = require("express");

const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

const sqlite3 = require("sqlite3");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT
    *
    FROM
    cricket_team
    ORDER BY 
    player_id;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;

  const { player_name, jersey_number, role } = playerDetails;

  const addPlayerQuery = `
    INSERT INTO 
    cricket_team(player_name, jersey_number, role)
    VALUES 
    (
    '${player_name}',
    '${jersey_number}',
    '${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `
    SELECT 
    *
    FROM
    cricket_team 
    where 
    player_id = ${playerId};`;
  const player = await db.run(getPlayerDetails);
  response.send(player);
});

module.exports = app;
