package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

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
	id, err := jsonparser.GetInt(bodyBytes)
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

func Test(w http.ResponseWriter, r *http.Request) {

	fmt.Println("test")

}
