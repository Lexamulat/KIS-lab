package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/buger/jsonparser"
)

var DB *sql.DB

type DBCategory struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type DBSubCategory struct {
	id_subc   int    `json:"id_subc"`
	id_cat    string `json:"id_cat"`
	name_subc string `json:"name_subc"`
	url_subc  string `json:"url_subc"`
}

var DeletedCategory DBCategory

func GetIndex(w http.ResponseWriter, r *http.Request) {
	// tmpl, _ := template.ParseFiles("tmpl/index.html")
	tmpl, _ := template.ParseGlob("tmpl/*.html")
	err := tmpl.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		panic(err)
	}

}

func Insert(w http.ResponseWriter, r *http.Request) {

	fmt.Println("insert")

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
		fmt.Println("here")
		affected, _ = res.RowsAffected()
	}
	fmt.Println(affected)

	fmt.Fprintf(w, strconv.Itoa(int(affected)))
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

func Restore(w http.ResponseWriter, r *http.Request) {
	status := "success"
	if DeletedCategory.ID == 0 {
		status = "failed"
	} else {
		_, err := DB.Exec("INSERT INTO Category(id_cat,name_cat, url_cat) VALUES(?,?,?)", DeletedCategory.ID, DeletedCategory.Name, DeletedCategory.URL)
		if err != nil {
			log.Fatal(err)
		}
		DeletedCategory.ID = 0
	}
	outJSON, _ := json.Marshal(status)
	fmt.Fprintf(w, string(outJSON))
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	id := string(bodyBytes)

	rows, err := DB.Query(`SELECT * FROM Category WHERE id_cat = ?`, id)

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		rows.Scan(&DeletedCategory.ID, &DeletedCategory.Name, &DeletedCategory.URL)
	}

	res, err := DB.Exec("DELETE FROM Category WHERE id_cat = ?", id)

	if err != nil {
		log.Fatal(err)
	}

	affected, _ := res.RowsAffected()
	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}

func GetList(w http.ResponseWriter, r *http.Request) {

	//все равно нич не приходит
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	sortType := string(bodyBytes)

	//ASC / DESC
	rows, err := DB.Query(`SELECT * FROM Category ORDER BY name_cat ` + sortType)

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

func SubGetList(w http.ResponseWriter, r *http.Request) {
	// bodyBytes, _ := ioutil.ReadAll(r.Body)
	// sortType := string(bodyBytes)
	id := 135
	rows, err := DB.Query(`SELECT * FROM Subcategory WHERE id_cat = ?`, id)

	if err != nil {
		log.Fatal(err)
	}

	el := []DBSubCategory{}
	for rows.Next() {
		var temp DBSubCategory
		rows.Scan(&temp.id_subc, &temp.id_cat, &temp.name_subc, &temp.url_subc)
		el = append(el, temp)
		fmt.Println(el)
	}

	outJSON, _ := json.Marshal(el)
	fmt.Fprintf(w, string(outJSON))
}

func DeleteOrCreate(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	action := string(bodyBytes)
	status := "success"

	if action == "create" {

		sqlStmt := `
	 CREATE TABLE University (ID integer  primary key autoincrement, Univ_name text, Acronim text, Create_date integer);
	 `
		_, err := DB.Exec(sqlStmt)
		if err != nil {
			status = "failed"
		}

	} else {

		sqlStmt := `DROP TABLE University`
		_, err := DB.Exec(sqlStmt)
		if err != nil {
			status = "failed"
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
	res, err := DB.Exec("UPDATE Category SET name_cat = ?, url_cat=?  WHERE id_cat = ?",
		name, url, strconv.Itoa(int(id)))

	if err == nil {
		affected, _ = res.RowsAffected()
	}

	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}
