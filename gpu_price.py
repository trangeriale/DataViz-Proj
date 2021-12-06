import requests
from bs4 import BeautifulSoup
import pandas as pd

HEADERS = {'User-Agent': 'Mozilla/5.0'}

res_price_2021 = requests.get(
    "https://www.techspot.com/article/2369-gpu-pricing-2021-update/",
    headers=HEADERS)
#print(res_price_2021.status_code)

#print(res_price_2021)

parsed_res = BeautifulSoup(res_price_2021.content, 'html.parser')

n_table = 0

cols = {}

#current cols don't have names, so we add that
sample_table = parsed_res.find('table', {'class': 'article-table alt'})
#n_table += 1
cols["GPU"] = []
#print(t.select_one("tr").text.split('\n'))
name_list = sample_table.select_one("tr").text.split('\n')[:-1]

#the first two strings were blank/special character
for c_name in name_list[2:]:
    cols[c_name] = []

#print(cols)
#have to not select the first row which has the table head/column name
#that we just selected

for t in parsed_res.find_all('table', {"class": "article-table alt"}):
    for row in t.select("tr")[1:-1]:
        r_data = row.text.split('\n')[1:-1]
        #print(r_data)
        data_index = 0
        for c_name in cols:
            data = r_data[data_index]
            if c_name == "GPU":
                #process GPU names
                data = data.replace("GeForce", "Nvidia")
                data = data.replace("Radeon", "AMD Radeon")
                #check if GPU is super or Ti type or not
                super = data.find("Super")
                ti = data.find("Ti")
                if super > 0:
                    data = data[:super - 1] + "S " + "(" + data[super:] + ")"
                if ti > 0:
                    data = data[:ti - 1] + "-Ti" + data[(ti + 2):]
            cols[c_name].append(data)
            data_index += 1

#Nvidia RTX 2080-Ti

#print("final produdct", cols)
'''
How the table would look like
name -> [radeon1, radeon 2]
msrp -> [1000, 650]
#table = [{"Radeon": {"MSRP": "15"}}]

df = pd.DataFrame({
    'name': ['Raphael', 'Donatello'],
    'mask': ['red', 'purple'],
    'weapon': ['sai', 'bo staff']
})
'''
'''
lam the nao de extract price

'''
gpu_price = pd.DataFrame(cols).to_csv("gpu_price.csv", index=False, mode="w+")
