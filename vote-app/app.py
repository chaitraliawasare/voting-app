from flask import Flask, request, render_template_string
import redis

# Create Flask app
app = Flask(__name__)

# Connect to Redis
redis_client = redis.Redis(
    host='redis',
    port=6379,
    decode_responses=True
)

# Simple HTML page
HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Cats vs Dogs Voting App</title>
</head>
<body style="font-family: Arial; text-align:center; margin-top:100px;">

    <h1>Cats 🐱 vs Dogs 🐶</h1>

    <form method="POST">

        <button type="submit" name="vote" value="cats">
            Vote Cats 🐱
        </button>

        <button type="submit" name="vote" value="dogs">
            Vote Dogs 🐶
        </button>

    </form>

    <h2>{{ message }}</h2>

</body>
</html>
"""

# Main route
@app.route('/', methods=['GET', 'POST'])
def vote():

    message = ""

    # When user clicks button
    if request.method == 'POST':

        # Get selected vote
        selected_vote = request.form['vote']

        # Push vote into Redis queue
        redis_client.rpush('votes', selected_vote)

        message = f"You voted for {selected_vote}!"

    return render_template_string(HTML, message=message)

# Run Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)