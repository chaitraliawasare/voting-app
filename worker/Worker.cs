using StackExchange.Redis;
using Npgsql;

namespace worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Connect to Redis
        var redis = await ConnectionMultiplexer.ConnectAsync("redis:6379");
        var redisDb = redis.GetDatabase();

        // PostgreSQL connection string
        var connectionString =
            "Host=postgres;Port=5432;Username=postgres;Password=password;Database=votingdb";

        _logger.LogInformation("Worker started...");

        while (!stoppingToken.IsCancellationRequested)
        {
            Console.WriteLine("Checking Redis queue...");

            var vote = await redisDb.ListLeftPopAsync("votes");

            Console.WriteLine($"Vote received: {vote}");

            if (!vote.IsNullOrEmpty)
            {
                Console.WriteLine("Connecting to PostgreSQL...");

                _logger.LogInformation($"Processing vote: {vote}");

                await using var dbConnection =
                new NpgsqlConnection(connectionString);

                await dbConnection.OpenAsync();

                Console.WriteLine("Connected to PostgreSQL");

                var query = "INSERT INTO votes (animal) VALUES (@animal)";

                await using var cmd = new NpgsqlCommand(query, dbConnection);

                cmd.Parameters.AddWithValue("animal", vote.ToString());

                await cmd.ExecuteNonQueryAsync();

                Console.WriteLine("Vote inserted successfully");

                _logger.LogInformation($"Saved {vote} into PostgreSQL");
             }

            await Task.Delay(1000, stoppingToken);
        }
    }
}