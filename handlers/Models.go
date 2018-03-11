package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/buger/jsonparser"
)

type DBModels struct { //variables must begin with a capital
	//letter, otherwise they can not be exported to main.go client(undifined)
	Idmod       int    `json:"id_mod"`
	Idsubcat    string `json:"id_subcat"`
	Namemod     string `json:"name_mod"`
	Price       string `json:"price"`
	Description string `json:"description"`
	Picture     string `json:"picture"`
}

func ModGetList(w http.ResponseWriter, r *http.Request) {

	bodyBytes, _ := ioutil.ReadAll(r.Body)
	idStr, _ := jsonparser.GetString(bodyBytes)
	id, _ := strconv.Atoi(idStr)
	rows, err := DB.Query(`SELECT * FROM Model WHERE id_subcat = ?`, id)

	if err != nil {
		log.Fatal(err)
	}

	el3 := []DBModels{}
	for rows.Next() {
		var temp DBModels
		rows.Scan(&temp.Idmod, &temp.Idsubcat, &temp.Namemod, &temp.Price, &temp.Description, &temp.Picture)
		el3 = append(el3, temp)

	}

	outJSON, _ := json.Marshal(el3)
	fmt.Fprintf(w, string(outJSON))

}

func ModDeleteItem(w http.ResponseWriter, r *http.Request) {

	bodyBytes, _ := ioutil.ReadAll(r.Body)
	id, _ := jsonparser.GetString(bodyBytes)

	res, err := DB.Exec("DELETE FROM Model WHERE id_mod = ?", id)

	if err != nil {
		log.Fatal(err)
	}

	affected, _ := res.RowsAffected()
	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}

func ModSearch(w http.ResponseWriter, r *http.Request) {

	body, _ := ioutil.ReadAll(r.Body)

	name_mod, err := jsonparser.GetString(body, "name_mod")
	if err != nil {
		log.Fatal(err)
	}
	CurrentActiveSubCat, err := jsonparser.GetInt(body, "CurrentActiveSubCat")
	if err != nil {
		log.Fatal(err)
	}
	//bodyString := string(bodyBytes)

	qry := fmt.Sprintf(`SELECT * FROM Model WHERE id_subcat=%d AND
		GoToLower(name_mod, '%s') = 1`, CurrentActiveSubCat, strings.ToLower(name_mod))

	rows, err := DB.Query(qry)
	if err != nil {
		log.Fatal(err)
	}

	el3 := []DBModels{}
	for rows.Next() {
		var temp DBModels
		rows.Scan(&temp.Idmod, &temp.Idsubcat, &temp.Namemod, &temp.Price, &temp.Description, &temp.Picture)
		el3 = append(el3, temp)

	}

	outJSON, _ := json.Marshal(el3)
	fmt.Fprintf(w, string(outJSON))
}

func ModEdit(w http.ResponseWriter, r *http.Request) {
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	affected := int64(0)

	idmod, err := jsonparser.GetInt(bodyBytes, "id_mod")
	if err != nil {
		log.Fatal(err)
	}
	namemod, err := jsonparser.GetString(bodyBytes, "name_mod")
	if err != nil {
		log.Fatal(err)
	}
	price, err := jsonparser.GetString(bodyBytes, "price")
	if err != nil {
		log.Fatal(err)
	}
	description, err := jsonparser.GetString(bodyBytes, "description")
	if err != nil {
		log.Fatal(err)
	}
	picture, err := jsonparser.GetString(bodyBytes, "picture")
	if err != nil {
		log.Fatal(err)
	}
	res, err := DB.Exec("UPDATE Model SET name_mod = ?, price=?,description=?,picture=? WHERE id_mod = ?",
		namemod, price, description, picture, idmod)

	if err == nil {
		affected, _ = res.RowsAffected()
	}

	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}
func ModInsert(w http.ResponseWriter, r *http.Request) {

	affected := int64(0)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	idsubcat, err := jsonparser.GetInt(body, "id_subcat")
	if err != nil {
		log.Fatal(err)
	}
	name_mod, err := jsonparser.GetString(body, "name_mod")
	if err != nil {
		log.Fatal(err)
	}
	price, err := jsonparser.GetString(body, "price")
	if err != nil {
		log.Fatal(err)
	}
	description, err := jsonparser.GetString(body, "description")
	if err != nil {
		log.Fatal(err)
	}
	picture, err := jsonparser.GetString(body, "picture")
	if err != nil {
		log.Fatal(err)
	}
	res, err := DB.Exec("INSERT INTO Model(id_subcat, name_mod,price,description,picture) VALUES(?,?,?,?,?)", idsubcat, name_mod, price, description, picture)
	if err == nil {

		affected, _ = res.RowsAffected()
	}

	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}
