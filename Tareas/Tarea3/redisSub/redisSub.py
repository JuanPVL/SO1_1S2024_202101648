import redis

# Connect to local Redis instance
redis_client = redis.StrictRedis(host='10.246.236.59', port=6379, db=0)
channel = 'test'
pubsub = redis_client.pubsub()
pubsub.subscribe(channel)
print(f"Subscribed to {channel}. Waiting for messages...")
for message in pubsub.listen():
    if message['type'] == 'message':
        print(f"{message['data'].decode('utf-8')}")