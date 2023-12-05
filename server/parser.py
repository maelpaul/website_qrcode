def is_ip_already_in_file(new_ip, filename):
    with open('../data/'+filename, 'r') as file:
        for ip in file:
            if new_ip+"\n" == ip:
                return True

    return False



def receive_paquet(addr, data):
    new_data = data.decode('utf-8')
    ip_addr = addr[0]
    
    if not is_ip_already_in_file(ip_addr, "ip.txt"):
        with open('../data/ip.txt', 'a') as file:
            file.write(ip_addr+"\n")

    process_packet_type(ip_addr, new_data)



def process_packet_type(ip_addr, new_data):
    
    packet_type = new_data.split()[0]

    if packet_type == "gps" :
        process_gps(ip_addr, new_data)
    elif packet_type == "url" :
        process_url(ip_addr, new_data)
    elif packet_type == "text" :
        process_text(ip_addr, new_data)
    else:
        print("autre")






def process_gps(ip_addr, new_data):
    already_here = False
    with open('../data/gps.txt', 'r') as file:
        lines = file.readlines()
        for i in range(len(lines)):
            ips = lines[i].split(",")[0]
            if ips == "'"+ip_addr+"'":
                lines[i] = "'" + ip_addr+"','" + new_data + "'\n"
                already_here = True
                       
    if already_here : 
        with open('../data/gps.txt', 'w') as file:
            file.writelines(lines)
    else :
        with open('../data/gps.txt', 'a') as file:
            file.write("'" + ip_addr+"','" + new_data + "'\n")

           


def process_url(ip_addr, new_data):
    with open('../data/url.txt', 'a') as file:
        file.write("'" + ip_addr+"','" + new_data + "'\n")


def process_text(ip_addr, new_data):
    with open('../data/text.txt', 'a') as file:
        file.write("'" + ip_addr+"','" + new_data + "'\n")