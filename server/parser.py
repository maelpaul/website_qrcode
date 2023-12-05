def is_ip_already_in_file(new_ip, filename):
    with open('../data/'+filename, 'r') as fichier:
        for ip in fichier:
            if new_ip+"\n" == ip:
                return True

    return False



def receive_paquet(addr, data):
    new_data = data.decode('utf-8')
    ip_addr = addr[0]
    
    if not is_ip_already_in_file(ip_addr, "ip.txt"):
        with open('../data/ip.txt', 'a') as fichier:
            fichier.write(ip_addr+"\n")

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
    if not is_ip_already_in_file(ip_addr, "gps.txt"): 
        with open('../data/gps.txt', 'a') as fichier:
            fichier.write("'" + ip_addr+"','" + new_data + "'\n")
    # a changer



def process_url(ip_addr, new_data):
    with open('../data/url.txt', 'a') as fichier:
        fichier.write("'" + ip_addr+"','" + new_data + "'\n")


def process_text(ip_addr, new_data):
    with open('../data/text.txt', 'a') as fichier:
        fichier.write("'" + ip_addr+"','" + new_data + "'\n")