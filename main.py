from ubm_scrape import *
from ubm_scrape import driver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException

import pandas as pd 
import os

part_buttons = driver.find_elements_by_class_name("nodec")
action = ActionChains(driver)

for i in range(len(part_buttons)):
	if part_buttons[i].text == "CPU":
		cpu_button = part_buttons[i]

#choose CPU tab

action.move_to_element(cpu_button).click(cpu_button).perform()

#prepare dataset to rolllll
UserID = list()
game_rating = list()
desktop_rating = list()
work_rating = list()
CPU = list()
GPU = list()
SSD = list()
RAM = list()
MBD = list()

user_comp_data = {'UserID' : UserID, 'gameRating' : game_rating, 'desktopRating' : desktop_rating , 'workRating' : work_rating, 'CPU' : CPU, 'GPU' : GPU, 'SSD' : SSD, 'RAM' : RAM, 'MBD' : MBD}

user_count = 0
#logic: click on each user
#rmb to add longer range
for i in range(100):
	driver.refresh()
	driver.implicitly_wait(20)
	#just placeholder to wait till new shit comes up?
	newest_user_data = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "bglink")))
	driver.find_element_by_class_name('bglink').click()

	#start getting the data
	copy_button = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.CLASS_NAME, "fa-copy")))
	#filtered_list = [i for (i, v) in zip(list_a, filter) if v]

	driver.find_element_by_class_name("fa-copy").click()
	driver.implicitly_wait(60)

	#user computer info
	user_comp_info = driver.find_element_by_id("modalTextArea").text.split('\n')

	#in the case of missing data, skip this instance
	if(len(user_comp_info) < 6):
		continue

	#user_ID
	user_ID_and_rating = user_comp_info[0].split(' ')
	print(user_ID_and_rating)


	prefix_ID = '[url=https://www.userbenchmark.com/UserRun/'
	suffix_ID = ']UserBenchmarks:'
	
	user_ID = user_ID_and_rating[0][(len(prefix_ID)):(0-len(suffix_ID))]
	UserID.append(user_ID)

	#there is no missing data for ratings
	if(len(user_ID_and_rating) < 3):
		continue
	else:
		user_game_rating = user_ID_and_rating[2][:-1]
		#print(user_game_rating)
		game_rating.append(user_game_rating)

		user_desktop_rating = user_ID_and_rating[4][:-1]
		#print(user_desktop_rating)
		desktop_rating.append(user_desktop_rating)

		user_work_rating = user_ID_and_rating[6][:-6]
		work_rating.append(user_work_rating)

	#user CPU
	#might not need to find the word CPU but we'll see
	user_count += 1
	print("User count is: %d" % user_count)
	driver.implicitly_wait(20)
	driver.back()
	driver.implicitly_wait(20)
	driver.refresh()

print(user_comp_data['UserID'])





