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
