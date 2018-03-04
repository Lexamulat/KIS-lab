package main

//
//
import (
	"database/sql" // Интерфейс для работы со SQL-like БД
	"encoding/json"
	"fmt" // Шаблоны для выдачи html страниц
	"html/template"
	"io/ioutil"
	"log"      // Вывод информации в консоль
	"net/http" // Для запуска HTTP сервера
	"strings"

	"github.com/gorilla/mux"
	sqlite "github.com/mattn/go-sqlite3" // Драйвер для работы со SQLite3
	//home/federal/go/src/github.com/gitGUAP/KIS-lab4
	h "github.com/gitGUAP/KIS-lab4/handlers"
)

// DB указатель на соединение с базой данных
var DB *sql.DB

type DBCategory struct {
	ID   int    `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	URL  string `json:"url,omitempty"`
}

func GoToLower(str string, find string) bool {
	str = strings.ToLower(str)
	find = strings.ToLower(find)
	return strings.Index(str, find) != -1
}

func GetSearch(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	bodyString := string(bodyBytes)

	qry := fmt.Sprintf(`SELECT * FROM Category WHERE 
		GoToLower(name_cat, '%s') = 1`, strings.ToLower(bodyString))

	rows, err := DB.Query(qry)
	if err != nil {
		log.Fatal(err)
	}

	el := []DBCategory{}
	for rows.Next() {
		var temp DBCategory
		rows.Scan(&temp.ID, &temp.Name, &temp.URL)
		el = append(el, temp)
	}

	outJSON, _ := json.Marshal(el)
	fmt.Fprintf(w, string(outJSON))
}

func GetIndex(w http.ResponseWriter, r *http.Request) {

	rows, err := DB.Query(`SELECT * FROM Category`)
	if err != nil {
		log.Fatal(err)
	}

	tmpl, _ := template.ParseFiles("tmpl/index.html")

	el := []DBCategory{}
	for rows.Next() {
		var temp DBCategory
		rows.Scan(&temp.ID, &temp.Name, &temp.URL)
		el = append(el, temp)
	}

	tmpl.Execute(w, el)
}

func GetList(w http.ResponseWriter, r *http.Request) {
	rows, err := DB.Query(`SELECT * FROM Category`)
	if err != nil {
		log.Fatal(err)
	}

	el := []DBCategory{}
	for rows.Next() {
		var temp DBCategory
		rows.Scan(&temp.ID, &temp.Name, &temp.URL)
		el = append(el, temp)
	}

	outJSON, _ := json.Marshal(el)
	fmt.Fprintf(w, string(outJSON))
}

func main() {

	h.Pr()
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

	DB, err = sql.Open("sqlite3_custom", "./sqlite.db")
	if err != nil {
		log.Fatal(err)
	}
	defer DB.Close()

	router := mux.NewRouter()
	s := http.StripPrefix("/static/", http.FileServer(http.Dir("./static/")))

	router.HandleFunc("/", GetIndex).Methods("GET")
	router.HandleFunc("/list", GetList).Methods("GET")
	router.HandleFunc("/search", GetSearch).Methods("POST")
	router.PathPrefix("/static/").Handler(s)

	log.Println("Listening...")
	// Запуск локального сервека на 8080 порту
	log.Fatal(http.ListenAndServe(":8080", router))
}
