package main

import (
	"database/sql" // Интерфейс для работы со SQL-like БД
	"encoding/json"
	"fmt" // Шаблоны для выдачи html страниц
	"io/ioutil"
	"log"      // Вывод информации в консоль
	"net/http" // Для запуска HTTP сервера
	"strconv"
	"strings"

	"github.com/buger/jsonparser"
	h "github.com/gitGUAP/KIS-lab4/handlers"
	"github.com/gorilla/mux"
	sqlite "github.com/mattn/go-sqlite3" // Драйвер для работы со SQLite3
)

func GoToLower(str string, find string) bool {
	str = strings.ToLower(str)
	find = strings.ToLower(find)
	return strings.Index(str, find) != -1
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	body1 := string(bodyBytes)

	res, err := h.DB.Exec("delete from Category where id_cat = " + body1)

	if err != nil {
		log.Fatal(err)
	}

	affected, _ := res.RowsAffected()
	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}

func GetSearch(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	bodyString := string(bodyBytes)

	qry := fmt.Sprintf(`SELECT * FROM Category WHERE 
		GoToLower(name_cat, '%s') = 1`, strings.ToLower(bodyString))

	rows, err := h.DB.Query(qry)
	if err != nil {
		log.Fatal(err)
	}

	el := []h.DBCategory{}
	for rows.Next() {
		var temp h.DBCategory
		rows.Scan(&temp.ID, &temp.Name, &temp.URL)
		el = append(el, temp)
	}

	outJSON, _ := json.Marshal(el)
	fmt.Fprintf(w, string(outJSON))
}

func GetList(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	bodyString := string(bodyBytes)

	rows, err := h.DB.Query(`SELECT * FROM Category ORDER BY name_cat ` + bodyString)

	if err != nil {
		log.Fatal(err)
	}

	el := []h.DBCategory{}
	for rows.Next() {
		var temp h.DBCategory
		rows.Scan(&temp.ID, &temp.Name, &temp.URL)
		el = append(el, temp)
	}

	outJSON, _ := json.Marshal(el)
	fmt.Fprintf(w, string(outJSON))
}

func DeleteOrCreate(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	bodyString := string(bodyBytes)
	status := "success"

	if bodyString == "create" {

		sqlStmt := `
	 create table University (ID integer  primary key autoincrement, Univ_name text, Acronim text, Create_date integer);
	 `
		_, err := h.DB.Exec(sqlStmt)
		if err != nil {
			status = "failed"
			log.Printf("%q: %s\n", err, sqlStmt)

		}
		//
	} else {

		sqlStmt := `DROP TABLE University`
		_, err := h.DB.Exec(sqlStmt)
		if err != nil {
			status = "failed"
			log.Printf("%q: %s\n", err, sqlStmt)

		}

	}
	outJSON, _ := json.Marshal(status)
	fmt.Fprintf(w, string(outJSON))
}

func Edit(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	affected := int64(0)
	id, err := jsonparser.GetInt(body, "id_cat")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(id)
	name, err := jsonparser.GetString(body, "name_cat")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(name)
	url, err := jsonparser.GetString(body, "url_cat")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(url)
	q := "update Category set name_cat = '" + name + "', url_cat='" + url + "'  where id_cat = " + strconv.Itoa(int(id))
	fmt.Println(q)
	res, err := h.DB.Exec(q)

	if err == nil {
		affected, _ = res.RowsAffected()
	}

	fmt.Fprintf(w, strconv.Itoa(int(affected)))
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
	router.HandleFunc("/list", GetList).Methods("POST")
	router.HandleFunc("/search", GetSearch).Methods("POST")
	router.HandleFunc("/del", DeleteItem).Methods("POST")
	router.HandleFunc("/insert", h.Insert).Methods("POST")
	router.HandleFunc("/table", DeleteOrCreate).Methods("POST")
	router.HandleFunc("/edit", Edit).Methods("POST")

	router.PathPrefix("/static/").Handler(s)

	log.Println("Listening...")
	// Запуск локального сервека на 8080 порту
	log.Fatal(http.ListenAndServe(":8080", router))
}
