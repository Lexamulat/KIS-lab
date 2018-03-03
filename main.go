package main

import (
	"database/sql"  // Интерфейс для работы со SQL-like БД
	"html/template" // Шаблоны для выдачи html страниц
	"log"           // Вывод информации в консоль
	"net/http"      // Для запуска HTTP сервера

	_ "github.com/mattn/go-sqlite3" // Драйвер для работы со SQLite3
)

// DB указатель на соединение с базой данных
var DB *sql.DB

type DBCategory struct {
	ID   int
	Name string
	URL  string
}

// Реализация обработчика запроса
func indexHandler(w http.ResponseWriter, r *http.Request) {
	// Выполнение запроса к базе данных
	rows, err := DB.Query(`SELECT * FROM Category`)
	if err != nil {
		log.Fatal(err)
	}

	// Чтение шаблона из файла
	tmpl, _ := template.ParseFiles("tmpl/index.html")

	// Создание массива для снятия слепка с базы данных,
	el := []DBCategory{}
	// Итерируемся по всем строкам, который вернул запрос SQLite
	for rows.Next() {
		var temp DBCategory
		rows.Scan(&temp.ID, &temp.Name, &temp.URL)
		// Записывает возвращенные данные в слепок
		el = append(el, temp)
	}

	// Вписываем данные в шаблон HTML страницы, дл отдачи пользователю
	tmpl.Execute(w, el)
}

func main() {
	var err error
	// Открытие соединения с БД SQLite3.db
	DB, err = sql.Open("sqlite3", "./sqlite.db")
	// Проверка установки соединения
	if err != nil {
		log.Fatal(err)
	}
	// Закрытие соединения с БД по выходу из функции main
	defer DB.Close()

	// Установка обработчика запроса по данному запросу
	fs := http.FileServer(http.Dir("static"))
	http.HandleFunc("/", indexHandler)
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	log.Println("Listening...")
	// Запуск локального сервека на 8080 порту
	log.Fatal(http.ListenAndServe(":8080", nil))
}
