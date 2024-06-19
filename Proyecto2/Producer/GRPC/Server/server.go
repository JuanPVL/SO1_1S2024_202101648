package main

import (
	"context"
	//"database/sql"
	"fmt"
	"log"
	"net"
	pb "server/proto"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
	"google.golang.org/grpc"
)

var ctx = context.Background()

// var db *sql.DB

type server struct {
	pb.UnimplementedGetInfoServer
}

const (
	port = ":3001"
)

type Data struct {
	Name  string
	Album string
	Year  string
	Rank  string
}


func writeDataKafka(data Data) {
	topic := "myvote"
	w := kafka.NewWriter(kafka.WriterConfig{
		Brokers:  []string{"my-cluster-kafka-bootstrap:9092"},
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	})

	dataEvent := fmt.Sprintf(`{"name": "%s", "album": "%s", "year": "%s", "rank": "%s"}`, data.Name, data.Album, data.Year, data.Rank)
	err := w.WriteMessages(ctx, kafka.Message{
		Key:   []byte(uuid.New().String()),
		Value: []byte(dataEvent),
	})
	if err != nil {
		log.Fatalln(err)
		log.Println("Error al escribir en Kafka", err)

	}
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de client: ", in.GetName())
	data := Data{
		Name:  in.GetName(),
		Album: in.GetAlbum(),
		Year:  in.GetYear(),
		Rank:  in.GetRank(),
	}
	fmt.Println(data)
	//insertMySQL(data)
	writeDataKafka(data)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí el comentario"}, nil
}

func main() {
	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	//mysqlConnect()

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}
