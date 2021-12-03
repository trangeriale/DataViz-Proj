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

cols = []
for t in parsed_res.find_all('table', {"class": "article-table alt"}):
    #n_table += 1
    print(t.select_one("tr").text.split('\n'))
    for row in t.select("tr")[1:]:
        print(row.text.split('\n'))
#print(n_table)

#table = [{"Radeon": {"MSRP": "15"}}]
df = pd.DataFrame({
    'name': ['Raphael', 'Donatello'],
    'mask': ['red', 'purple'],
    'weapon': ['sai', 'bo staff']
})

name = df.to_csv(index=False)