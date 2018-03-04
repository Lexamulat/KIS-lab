package handlers

import (
	"html/template"
	"log"      // Вывод информации в консоль
	"net/http" // Для запуска HTTP сервера
	// Интерфейс для работы со SQL-like БД
	// Шаблоны для выдачи html страниц
	// Драйвер для работы со SQLite3
)

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
