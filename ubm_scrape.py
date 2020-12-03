import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import webdriver_manager
from webdriver_manager.chrome import ChromeDriverManager
import nltk

#nltk.download('punkt')

#options = webdriver.ChromeOptions()
#options.add_argument('--ignore-certificate-errors')
#options.add_argument('--ignore-ssl-errors')

#driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)

from webdriver_manager.firefox import GeckoDriverManager

driver = webdriver.Firefox(executable_path=GeckoDriverManager().install())
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

#driver.get("https://cpu.userbenchmark.com/Software")


print('hell yea')
