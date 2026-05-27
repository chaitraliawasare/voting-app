const express = require('express');
const { Client } = require('pg');

const app = express();

const client = new Client({
    host: 'postgres',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'votingdb'
});

// Connect to PostgreSQL
async function connectWithRetry() {

    while (true) {

        try {

            await client.connect();

            console.log('Connected to PostgreSQL');

            break;

        } catch (err) {

            console.log('PostgreSQL not ready, retrying in 5 seconds...');

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

connectWithRetry();

app.get('/', async (req, res) => {

    try {

        // Query vote counts
        const catsResult = await client.query(
            "SELECT COUNT(*) FROM votes WHERE animal='cats'"
        );

        const dogsResult = await client.query(
            "SELECT COUNT(*) FROM votes WHERE animal='dogs'"
        );

        const cats = catsResult.rows[0].count;
        const dogs = dogsResult.rows[0].count;

        // HTML response
        res.send(`
            <html>
            <head>
                <title>Voting Results</title>
            </head>

            <body style="font-family: Arial; text-align:center; margin-top:100px;">

                <h1>Voting Results</h1>

                <h2>Cats 🐱: <span id="cats">${cats}</span></h2>

                <h2>Dogs 🐶: <span id="dogs">${dogs}</span></h2>

                <script>

                async function fetchVotes() {

                    const response = await fetch('/votes');

                    const data = await response.json();

                    let cats = 0;
                    let dogs = 0;

                    data.forEach(vote => {

                        if (vote.animal === 'cats') {
                            cats = vote.count;
                        }

                        if (vote.animal === 'dogs') {
                            dogs = vote.count;
                        }
                    });

                    document.getElementById('cats').innerText = cats;

                    document.getElementById('dogs').innerText = dogs;
                }

                setInterval(fetchVotes, 2000);

                fetchVotes();

                </script>

            </body>
            </html>
        `);

    } catch (err) {

        console.error(err);

        res.send('Error reading votes');

    }
});

app.get('/votes', async (req, res) => {

    const result = await client.query(`
        SELECT animal, COUNT(*) 
        FROM votes
        GROUP BY animal
    `);

    res.json(result.rows);
});

app.listen(3000, () => {
    console.log('Result app running on port 3000');
});