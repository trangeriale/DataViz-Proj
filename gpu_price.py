import requests
from bs4 import BeautifulSoup

BASE_URL = "https://en.wikipedia.org"

#HEADERS = { ' User-Agent: '}
HEADERS = {'User-Agent': 'Mozilla/5.0'}


def get_main_table():
    '''Get the wikitable list of Nobel winners'''
    #make a request to the nobel page
    response = requests.get(BASE_URL +
                            '/wiki/List_of_Nvidia_graphics_processing_units',
                            headers=HEADERS)
    #parse the response content with beautiful soup
    soup = BeautifulSoup(response.content, features="html.parser")

    #many tables on this page with different cpu/gpu generations
    tables = soup.find_all('table', {'class': 'wikitable'})

    return tables


GPU_list = get_main_table()

print(GPU_list[0].prettify())


def get_column_titles(table):
    ''' Get the Nobel categories from the table header '''
    cols = []
    for th in table.find('tr').find_all('th')[1:]:
        link = th.find('a')

    return cols


def get_nobel_winners_BS(table):
    cols = get_column_titles(table)
    winners = []
    for row in table.find_all('tr')[1:-1]:
        year = int(row.find('td').text)  # Gets 1st <td>
        for i, td in enumerate(row.find_all('td')[1:]):
            for winner in td.find_all('a'):
                href = winner.attrs['href']
                if not href.startswith('#endnote'):
                    winners.append({
                        'year': year,
                        'category': cols[i]['name'],
                        'name': winner.text,
                        'link': winner.attrs['href']
                    })
    return winners
