package handlers

import (
	"database/sql"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/buger/jsonparser"
)

var DB *sql.DB

type DBCategory struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

func GetIndex(w http.ResponseWriter, r *http.Request) {
	tmpl, _ := template.ParseFiles("tmpl/index.html")

	tmpl.Execute(w, nil)
}

func Insert(w http.ResponseWriter, r *http.Request) {
	affected := int64(0)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}

	name, err := jsonparser.GetString(body, "name_cat")
	if err != nil {
		log.Fatal(err)
	}
	url, err := jsonparser.GetString(body, "url_cat")
	if err != nil {
		log.Fatal(err)
	}

	res, err := DB.Exec("INSERT INTO Category(name_cat, url_cat) VALUES(?,?)", name, url)

	if err == nil {
		affected, _ = res.RowsAffected()
	}

	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}
