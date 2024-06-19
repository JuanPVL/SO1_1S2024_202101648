package main

import (
	"context"
	"encoding/json"
	"fmt"

	//"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	//"google.golang.org/genproto/googleapis/cloud/redis/v1"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
)

type Data struct {
	Name  string
	Album string
	Year  string
	Rank  string
}

var clientMongo, errormongo = connectMongoDB("mongodb://mongodb-service:27017")

var collection = clientMongo.Database("proyecto2").Collection("logs")

var redisDB = redis.NewClient(&redis.Options{
	Addr:     "redis-service:6379", // Redis server address
	Password: "",                   // No password set
	DB:       0,                    // Use default DB
})

func receiveData(dataEvent []byte) {
	var data Data
	err := json.Unmarshal(dataEvent, &data)
	if err != nil {
		fmt.Println("Error al decodificar el mensaje")
		return
	}
	fmt.Println("Recibí de Kafka: ", data)
	go uploadData(collection, data)
	go uploadDataRedis(data)
}

func connectMongoDB(uri string) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		return nil, err
	}

	// Check the connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		return nil, fmt.Errorf("couldn't connect to the database: %v", err)
	}
	fmt.Println("Connected to MongoDB!")

	return client, nil
}

func uploadData(collection *mongo.Collection, data Data) {
	// Get current date and time
	currentTime := time.Now()

	// Add current date and time to person document
	logCreateAT := bson.M{"name": data.Name, "album": data.Album, "year": data.Year, "rank": data.Rank, "hora": currentTime}

	// Inserting the document into the collection
	_, err := collection.InsertOne(context.Background(), logCreateAT)
	if err != nil {
		fmt.Println("error al insertar")
	}
}

func uploadDataRedis(data Data) {

	existe, err1 := redisDB.HExists(redisDB.Context(), "votes", data.Name+"-"+data.Album).Result()
	if err1 != nil {
		fmt.Println("Error al verificar si existe")
	}
	if existe {
		err := redisDB.HIncrBy(redisDB.Context(), "votes", data.Name+"-"+data.Album, 1).Err()
		if err != nil {
			fmt.Println("Error al subir a Redis")
		}
	} else {
		err := redisDB.HSet(redisDB.Context(), "votes", data.Name+"-"+data.Album, 1).Err()
		if err != nil {
			fmt.Println("Error al subir a Redis")
		}
	}

	fmt.Println("Subido a Redis")
	fmt.Println("Voto recibido a ", data.Name+"-"+data.Album)
}

func main() {
	if errormongo != nil {
		fmt.Println("Error al conectar a la base de datos")
	}
	topic := "myvote"

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:     []string{"my-cluster-kafka-bootstrap:9092"},
		Topic:       topic,
		Partition:   0,
		MinBytes:    10e3, // 10KB
		MaxBytes:    10e6, // 10MB
		StartOffset: kafka.LastOffset,
		GroupID:     uuid.New().String(),
	})

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			fmt.Println("Error al leer el mensaje")
			break
		}
		fmt.Printf("message at topic/partition/offset %v/%v/%v: %s = %s\n", m.Topic, m.Partition, m.Offset, string(m.Key), string(m.Value))
		receiveData(m.Value)
	}

	if err := r.Close(); err != nil {
		fmt.Println("Error al cerrar el reader")
	}
}
