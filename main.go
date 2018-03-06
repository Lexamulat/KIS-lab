package main

import (
	"database/sql" // Интерфейс для работы со SQL-like БД
	// Шаблоны для выдачи html страниц
	"log"      // Вывод информации в консоль
	"net/http" // Для запуска HTTP сервера
	"strings"

	h "github.com/gitGUAP/KIS-lab4/handlers"
	"github.com/gorilla/mux"
	sqlite "github.com/mattn/go-sqlite3" // Драйвер для работы со SQLite3
)

func GoToLower(str string, find string) bool {
	str = strings.ToLower(str)
	find = strings.ToLower(find)
	return strings.Index(str, find) != -1
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	sql.Register("sqlite3_custom", &sqlite.SQLiteDriver{
		ConnectHook: func(conn *sqlite.SQLiteConn) error {
			if err := conn.RegisterFunc("GoToLower", GoToLower, true); err != nil {
				return err
			}
			return nil
		},
	})

	var err error

	h.DB, err = sql.Open("sqlite3_custom", "./sqlite.db")
	if err != nil {
		log.Fatal(err)
	}
	defer h.DB.Close()

	router := mux.NewRouter()
	s := http.StripPrefix("/static/", http.FileServer(http.Dir("./static/")))

	router.HandleFunc("/", h.GetIndex).Methods("GET")
	router.HandleFunc("/list", h.GetList).Methods("POST")
	router.HandleFunc("/search", h.GetSearch).Methods("POST")
	router.HandleFunc("/del", h.DeleteItem).Methods("POST")
	router.HandleFunc("/insert", h.Insert).Methods("POST")
	router.HandleFunc("/table", h.DeleteOrCreate).Methods("POST")
	router.HandleFunc("/edit", h.Edit).Methods("POST")

	router.PathPrefix("/static/").Handler(s)

	log.Println("Listening...")
	// Запуск локального сервека на 8080 порту
	log.Fatal(http.ListenAndServe(":8080", router))
}
