package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

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

	bodyBytes, _ := ioutil.ReadAll(r.Body)
	id, _ := jsonparser.GetString(bodyBytes)

	res, err := DB.Exec("DELETE FROM Model WHERE id_mod = ?", id)

	if err != nil {
		log.Fatal(err)
	}

	affected, _ := res.RowsAffected()
	fmt.Fprintf(w, strconv.Itoa(int(affected)))
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
