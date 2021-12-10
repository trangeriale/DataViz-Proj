from os import close

f = open("./cpu_price.txt")
f_csv = open("./cpu_price.csv", "w")

for line in f:
    if line.startswith("CPU"):
        f_csv.write(line)
        continue
    acong = line.find("@")
    ghz = line.find("GHz")
    open_paren = line.find("(")
    close_paren = line.find(")")
    dot = line.find(".", close_paren)
    del_comma = line.find(",")
    dollar = line.find("$")
    if acong > 0:
        new_line = line[:acong -
                        1] + line[ghz + 3:open_paren] + "," + line[open_paren:(
                            dot + 2)] + "," + line[dot + 2:del_comma] + line[
                                del_comma + 1:dollar] + "," + line[dollar:]
    else:
        new_line = line[:open_paren] + "," + line[open_paren:(
            dot + 2)] + "," + line[dot + 2:del_comma] + line[
                del_comma + 1:dollar] + "," + line[dollar:]
    f_csv.write(new_line)
