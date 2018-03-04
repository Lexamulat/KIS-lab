package handlers

import (
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

var DB *sql.DB

func Pr() {

	fmt.Println(124)
}

type DBCategory struct {
	ID   int    `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	URL  string `json:"url,omitempty"`
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
