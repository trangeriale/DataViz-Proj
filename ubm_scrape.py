import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import webdriver_manager
from webdriver_manager.chrome import ChromeDriverManager
import nltk

nltk.download('punkt')

driver = webdriver.Chrome(ChromeDriverManager().install())

print('hell yea')


driver.get("https://cpu.userbenchmark.com/Software")

