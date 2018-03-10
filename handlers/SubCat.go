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

type DBSubCategory struct { //variables must begin with a capital
	//letter, otherwise they can not be exported to main.go client(undifined)
	Idsubc   int    `json:"id_subc"`
	Idcat    string `json:"id_cat"`
	Namesubc string `json:"name_subc"`
	Urlsubc  string `json:"url_subc"`
}

func SubGetList(w http.ResponseWriter, r *http.Request) {

	bodyBytes, _ := ioutil.ReadAll(r.Body)
	id, _ := jsonparser.GetInt(bodyBytes)
	rows, err := DB.Query(`SELECT * FROM Subcategory WHERE id_cat = ?`, id)

	if err != nil {
		log.Fatal(err)
	}

	el2 := []DBSubCategory{}
	for rows.Next() {
		var temp DBSubCategory
		rows.Scan(&temp.Idsubc, &temp.Idcat, &temp.Namesubc, &temp.Urlsubc)
		el2 = append(el2, temp)

	}

	outJSON, _ := json.Marshal(el2)
	fmt.Fprintf(w, string(outJSON))
}

func SubInsert(w http.ResponseWriter, r *http.Request) {
	affected := int64(0)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	idcat, err := jsonparser.GetInt(body, "id_cat")
	if err != nil {
		log.Fatal(err)
	}
	namesubc, err := jsonparser.GetString(body, "name_subc")
	if err != nil {
		log.Fatal(err)
	}
	urlsubc, err := jsonparser.GetString(body, "url_subc")
	if err != nil {
		log.Fatal(err)
	}
	res, err := DB.Exec("INSERT INTO Subcategory(id_cat, name_subc,url_subc) VALUES(?,?,?)", idcat, namesubc, urlsubc)
	if err == nil {

		affected, _ = res.RowsAffected()
	}

	fmt.Fprintf(w, strconv.Itoa(int(affected)))

}

func SubEdit(w http.ResponseWriter, r *http.Request) {

	body, _ := ioutil.ReadAll(r.Body)
	affected := int64(0)

	idsubc, err := jsonparser.GetInt(body, "id_subc")

	if err != nil {
		fmt.Println("err")
		log.Fatal(err)
	}

	namesubc, err := jsonparser.GetString(body, "name_subc")
	if err != nil {
		log.Fatal(err)
	}

	urlsubc, err := jsonparser.GetString(body, "url_subc")
	if err != nil {
		log.Fatal(err)
	}

	res, err := DB.Exec("UPDATE Subcategory SET name_subc = ?, url_subc=?  WHERE id_subc = ?",
		namesubc, urlsubc, strconv.Itoa(int(idsubc)))

	if err == nil {
		affected, _ = res.RowsAffected()
	}

	fmt.Fprintf(w, strconv.Itoa(int(affected)))
}
