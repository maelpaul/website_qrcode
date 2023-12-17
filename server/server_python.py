# Server listening for the packets from the corrupted phones

import socket
from parser import receive_packet

host= '172.20.10.10'
port=12345

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((host, port))

server_socket.listen(5)

print("Waiting for connections...")


while (True):
    client_socket, addr = server_socket.accept()

    print("Connection set with ", addr)
    data = client_socket.recv(1024)
    receive_packet(addr, data)
    print(f"Received from {addr[0]}")



    if not data:
        break


client_socket.close()
server_socket.close()