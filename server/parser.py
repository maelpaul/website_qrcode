def is_ip_already_known(new_ip):
    with open('../data/ip.txt', 'r') as fichier:
        for ip in fichier:
            if new_ip+"\n" == ip:
                return True

    return False



def receive_paquet(addr, data):
    new_data = data.decode('utf-8')
    ip_addr = addr[0]
    
    with open('../data/paquets.txt', 'a') as fichier:
        fichier.write("'"+ip_addr + "','"+new_data+"'\n")

    if not is_ip_already_known(ip_addr):
        with open('../data/ip.txt', 'a') as fichier:
            fichier.write(ip_addr+"\n")




